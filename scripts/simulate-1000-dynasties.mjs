import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=fs.readFileSync(path.join(root,'app/players.generated.ts'),'utf8');
const raw=source.slice(source.indexOf('['),source.lastIndexOf(']')+1);
const base=JSON.parse(raw).map(p=>({...p,points:Number(p.points)}));
const positions=['QB','RB','WR','TE'];
const groups=Object.fromEntries(positions.map(pos=>[pos,base.filter(p=>p.pos===pos)]));
const players=base.map(p=>{
  const peer=groups[p.pos];
  const percentile=peer.filter(x=>x.points>p.points).length/peer.length*100;
  const tier=percentile<=3?'platinum':percentile<=8?'ruby':percentile<=20?'gold':percentile<=40?'emerald':percentile<=65?'silver':'bronze';
  return {...p,percentile,tier,value:Math.round(12+(100-percentile)*1.18)};
});
const spinOdds=[['platinum',2],['ruby',10],['gold',26],['emerald',29],['silver',21],['bronze',12]];
const benchOdds={
  first:[['platinum',17],['ruby',40],['gold',35],['emerald',8],['silver',0],['bronze',0]],
  second:[['platinum',7],['ruby',20],['gold',32],['emerald',32],['silver',6],['bronze',5]],
  third:[['platinum',3],['ruby',8],['gold',18],['emerald',25],['silver',26],['bronze',20]],
};
const pickInfo={first:{value:70,min:15,max:180,power:.62,minDV:70,targetDV:90},second:{value:40,min:8,max:115,power:.9,minDV:40,targetDV:55},third:{value:20,min:4,max:55,power:1.08,minDV:20,targetDV:30}};
let seed=0x5f3759df;
function random(){seed=(seed+0x6D2B79F5)|0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}
function choice(list){return list[Math.floor(random()*list.length)]}
function weighted(entries){let roll=random()*entries.reduce((sum,[,weight])=>sum+weight,0);return entries.find(([,weight])=>(roll-=weight)<=0)?.[0]||entries.at(-1)[0]}
function eligible(label,p){return label==='FLX'||label==='BENCH'?p.pos!=='QB':p.pos===label}
function spinPlayer(label,forceElite,used){const odds=forceElite?spinOdds.filter(([tier])=>tier==='platinum'||tier==='ruby'):spinOdds;const tier=weighted(odds);const pool=players.filter(p=>eligible(label,p)&&p.tier===tier&&!used.has(p.name));return choice(pool.length?pool:players.filter(p=>eligible(label,p)&&!used.has(p.name)))}
function openPositions(slots){const flexOpen=slots.some(s=>s.label==='FLX'&&!s.player);return positions.filter(pos=>slots.some(s=>s.label===pos&&!s.player)||(pos!=='QB'&&flexOpen))}
function slotFor(slots,p){const direct=slots.findIndex(s=>s.label===p.pos&&!s.player);return direct>=0?direct:slots.findIndex(s=>s.label==='FLX'&&!s.player)}
function benchPlayer(pick,used){const tier=weighted(benchOdds[pick]);const pool=players.filter(p=>p.pos!=='QB'&&p.tier===tier&&!used.has(p.name));return choice(pool.length?pool:players.filter(p=>p.pos!=='QB'&&!used.has(p.name)))}
function upgradePlayer(label,current,pick,used){const cfg=pickInfo[pick];const upgrades=players.filter(p=>eligible(label,p)&&p.points>current.points&&!used.has(p.name));if(!upgrades.length)return null;const valueUpgrades=upgrades.filter(p=>p.value-current.value>=cfg.minDV);const candidates=valueUpgrades.length?valueUpgrades:upgrades;const desired=current.points+cfg.min+Math.pow(random(),cfg.power)*(cfg.max-cfg.min);const capped=candidates.filter(p=>p.points<=current.points+cfg.max);const pool=capped.length?capped:candidates;return [...pool].sort((a,b)=>(Math.abs(a.points-desired)+Math.abs((a.value-current.value)-cfg.targetDV))-(Math.abs(b.points-desired)+Math.abs((b.value-current.value)-cfg.targetDV)))[Math.floor(random()*Math.min(6,pool.length))]}

const firstWords=['Sunday','Midnight','Golden','Fourth Down','Gridiron','Red Zone','Hail Mary','Dynasty','End Zone','Two Minute','Prime Time','Goal Line','Victory','Iron','Royal','Neon','Blitz','Crown','Championship','Fantasy','Lucky','Undefeated','Overtime','Touchdown','Pigskin','Play Action','Deep Ball','No Huddle','Pocket','Trophy','All-Pro','Playoff'];
const lastWords=['Kings','Royals','Renegades','Legends','Titans','Bandits','Bulls','Wolves','Warriors','Outlaws','Aces','Giants','Glory','Empire','Reign','Rush','Storm','Squad','Machine','Mavericks','Champions','Crew','Club','Heroes','Hustle','Blitz','Dynasty','Dream Team','Playmakers','Jackpot','Contenders','Crushers'];
const usedNames=new Set();
function teamName(){let name;do{name=`${choice(firstWords)} ${choice(lastWords)}`.slice(0,24)}while(usedNames.has(name));usedNames.add(name);return name}

function simulate(index){
  const slots=['QB','RB','RB','WR','WR','TE','FLX','BENCH'].map(label=>({label,player:null}));
  const used=new Set();
  const skill=.2+random()*.8;
  while(slots.slice(0,7).some(s=>!s.player)){
    const open=openPositions(slots),firstPos=choice(open),alternatives=open.filter(p=>p!==firstPos),secondPos=choice(alternatives.length?alternatives:open);
    const elite=slots.slice(0,7).filter(s=>s.player&&['platinum','ruby'].includes(s.player.tier)).length;
    const remaining=slots.slice(0,7).filter(s=>!s.player).length;
    const forceElite=remaining<=1-elite;
    const first=spinPlayer(firstPos,forceElite,used);const temp=new Set(used).add(first.name);const second=spinPlayer(secondPos,forceElite,temp);
    const selected=random()<(.58+.34*skill)?(first.points>=second.points?first:second):(random()<.5?first:second);
    const target=slotFor(slots,selected);slots[target].player=selected;used.add(selected.name);
  }
  const benchPick=weighted(skill>.65?[['first',15],['second',30],['third',55]]:[['first',30],['second',38],['third',32]]);
  const remainingPicks=['first','second','third'].filter(p=>p!==benchPick);
  const bench=benchPlayer(benchPick,used);slots[7].player=bench;used.add(bench.name);
  const respinCount=random()<(.30+.25*skill)?(random()<.72?1:2):0;
  for(let n=0;n<respinCount&&remainingPicks.length;n++){
    const pickIndex=Math.floor(random()*remainingPicks.length),pick=remainingPicks.splice(pickIndex,1)[0];
    const candidates=slots.map((s,i)=>({...s,i})).filter(s=>s.player).sort((a,b)=>a.player.points-b.player.points);
    const target=choice(candidates.slice(0,Math.min(3,candidates.length)));
    const next=upgradePlayer(target.label,target.player,pick,used);
    if(next){used.delete(target.player.name);used.add(next.name);slots[target.i].player=next}
  }
  const rosterPoints=+slots.reduce((sum,s)=>sum+s.player.points,0).toFixed(1);
  const unspentDV=remainingPicks.reduce((sum,p)=>sum+pickInfo[p].value,0);
  return {id:`simulation-${String(index+1).padStart(4,'0')}`,name:teamName(),rosterPoints,unspentDV,franchiseValue:+(rosterPoints+unspentDV).toFixed(1)};
}

const results=Array.from({length:1000},(_,i)=>simulate(i)).sort((a,b)=>b.franchiseValue-a.franchiseValue);
const bands=[5,10,18,28,40,52,64,74,82,88,93,97,99];
const thresholds=Object.fromEntries(bands.map(p=>[p,results[Math.ceil(results.length*p/100)-1].franchiseValue]));
const escape=value=>String(value).replaceAll("'","''");
const rows=results.map((r,i)=>`('${r.id}', ${r.franchiseValue.toFixed(1)}, ${r.rosterPoints.toFixed(1)}, ${r.unspentDV}, '${escape(r.name)}', 1, '2026-08-30T${String(Math.floor(i/3600)).padStart(2,'0')}:${String(Math.floor(i/60)%60).padStart(2,'0')}:${String(i%60).padStart(2,'0')}Z')`);
const sql=`ALTER TABLE dynasty_results ADD COLUMN simulated INTEGER NOT NULL DEFAULT 0;\n\nINSERT OR IGNORE INTO dynasty_results (id, franchise_value, roster_points, unspent_dv, draft_name, simulated, created_at) VALUES\n${rows.join(',\n')};\n\nCREATE INDEX IF NOT EXISTS idx_dynasty_results_simulated ON dynasty_results(simulated);\n`;
fs.writeFileSync(path.join(root,'drizzle/0002_simulated_dynasties.sql'),sql);
fs.writeFileSync(path.join(root,'app/simulation-summary.generated.json'),JSON.stringify({seed:'0x5f3759df',runs:1000,thresholds,best:results[0],median:results[499],worst:results.at(-1)},null,2)+'\n');
console.log(JSON.stringify({thresholds,best:results[0],median:results[499],worst:results.at(-1)},null,2));
