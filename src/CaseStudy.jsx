import { sitePath } from './paths.mjs';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ArrowCounterClockwise, Play, Pause, X, Check } from '@phosphor-icons/react';

const forgeSteps = [
  { title:'描述创作任务', label:'BRIEF', headline:'先明确声音为什么发生。', body:'用场景、动作、情绪和播放用途表达需求。这里的示例是武侠战斗背景音乐：要支持连续战斗，也要知道何时开始与结束。', output:'产物：明确的声音需求与可检查的生成提示词。' },
  { title:'试听与调整', label:'REVIEW', headline:'生成只是候选，听过才有判断。', body:'保留候选版本，比较风格与听感；用增益、音调、EQ 等轻量参数调整，避免每一次修改都依赖重新生成。下方可试听实际功能验收中使用的 16 秒 AI 生成素材。', output:'产物：创作者选定的声音与调整参数。' },
  { title:'保存为 Pack', label:'PACKAGE', headline:'让声音带着播放规则进入交付。', body:'把选定声音、调整参数和版本保存为可管理的 Pack。素材与播放设置一起交付，后续调整有明确对象，能够复查并导出。', output:'产物：带素材、调音参数和版本信息的音频 Pack。' },
  { title:'游戏接入与验证', label:'INTEGRATE', headline:'最后的判断，发生在游戏里。', body:'将 Pack 绑定到游戏事件，验证开始、循环和停止。正式模板验收用镜头控制状态触发音乐；定制游戏仍需要按照自身事件与构建流程完成适配。', output:'产物：游戏中的真实播放行为与验证记录。' },
];

function AudioPreview() {
  const ref=useRef(null);
  const [playing,setPlaying]=useState(false);
  const [time,setTime]=useState(0);
  const [duration,setDuration]=useState(16);
  const [error,setError]=useState('');
  async function toggle() {
    if(playing) { ref.current.pause(); return; }
    try { await ref.current.play(); setError(''); } catch { setError('音频暂时无法播放，请下载试听。'); }
  }
  const format=t => `00:${String(Math.floor(t)).padStart(2,'0')}`;
  return <div className="audio-preview">
    <audio ref={ref} src={sitePath('/assets/forgeax-demo.wav')} preload="metadata" onLoadedMetadata={e => setDuration(e.currentTarget.duration)} onTimeUpdate={e => setTime(e.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError('音频暂时无法播放，请下载试听。')}/>
    <div className="audio-label"><strong>武侠战斗 BGM</strong><span>AI 生成素材 · 实际功能验收使用 · 16 秒</span></div>
    <div className="audio-controls"><button className="audio-play icon-button" onClick={toggle} aria-label={playing ? '暂停试听' : '播放试听'}>{playing ? <Pause size={21} weight="fill"/> : <Play size={21} weight="fill"/>}</button><span className="audio-time">{format(time)}</span><input type="range" min="0" max={duration} step="0.1" value={Math.min(time,duration)} onChange={e => { ref.current.currentTime=Number(e.target.value); setTime(Number(e.target.value)); }} aria-label="音频播放进度"/><span className="audio-time">{format(duration)}</span></div>
    <p className="audio-note">演示素材用于说明交付链路，不代表商业成品的听感验收。<a href={sitePath('/assets/forgeax-demo.wav')} download="ForgeaX_验收用音乐.wav">下载音频 <ArrowUpRight size={14}/></a></p>{error && <p role="alert">{error}</p>}
  </div>;
}

function ForgeFlow() {
  const [step,setStep]=useState(0);
  const s=forgeSteps[step];
  return <div className="workflow-demo forge-demo">
    <p className="eyebrow">流程导览 · 使用真实项目素材</p>
    <div className="workflow-tabs" role="tablist" aria-label="声音交付流程">{forgeSteps.map((s,i) => <button key={s.label} role="tab" id={`flow-tab-${i}`} aria-selected={step === i} aria-controls="flow-panel" tabIndex={step === i ? 0 : -1} onClick={() => setStep(i)} onKeyDown={e => { if(['ArrowRight','ArrowLeft'].includes(e.key)) { e.preventDefault(); const next=(i+(e.key === 'ArrowRight' ? 1 : 3))%4; setStep(next); document.getElementById(`flow-tab-${next}`)?.focus(); } }}><span>0{i+1}</span>{s.title}</button>)}</div>
    <div className="workflow-panel" id="flow-panel" role="tabpanel" aria-labelledby={`flow-tab-${step}`}><span className="eyebrow">{s.label}</span><h3>{s.headline}</h3><p>{s.body}</p><div className="workflow-output"><Check size={19}/><span>{s.output}</span></div><button className="text-link" onClick={() => setStep((step+1)%4)}>{step === 3 ? '回到需求' : '下一步'} <ArrowRight size={22}/></button></div>
    <AudioPreview/>
  </div>;
}

const stateInfo = {
  idle:['01 / 读取工程','先查工程，再准备行动。'], inspected:['02 / 已读取','人声轨的真实路由，是计划的起点。'],
  planned:['03 / 计划已生成','先把改动说清楚，再请求提交。'], awaiting:['04 / 等待确认','Agent 请求提交，创作者决定是否执行。'],
  committed:['05 / 已提交','一份计划，形成一笔可撤销事务。'], undoing:['06 / 等待撤销确认','外部撤销同样由创作者确认。'],
  undone:['07 / 已撤销','恢复原工程，保留清楚的操作状态。'], cancelled:['计划已取消','工程没有被这份计划改动。'],
};

function FormaDemo() {
  const [state,setState]=useState('idle');
  const [dialog,setDialog]=useState(false);
  const dialogRef=useRef(null);
  const triggerRef=useRef(null);
  const demoRef=useRef(null);
  const tracksChanged=['committed','undoing'].includes(state);
  useEffect(() => {
    if(dialog) dialogRef.current?.querySelector('button')?.focus();
    else if(triggerRef.current) {demoRef.current?.querySelector('.demo-action button')?.focus();triggerRef.current=null;}
  },[dialog]);
  function request(next,e) {triggerRef.current=e.currentTarget;setState(next);setDialog(true);}
  function finish(next) {setState(next);setDialog(false);}
  function keyTrap(e) {
    if(e.key==='Escape') {e.preventDefault();finish(state==='undoing' ? 'committed' : 'cancelled');}
    if(e.key==='Tab') {const buttons=dialogRef.current.querySelectorAll('button');const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey && document.activeElement===first) {e.preventDefault();last.focus();} else if(!e.shiftKey && document.activeElement===last) {e.preventDefault();first.focus();}}
  }
  return <div className="workflow-demo forma-demo" ref={demoRef}>
    <div className="demo-head"><p className="eyebrow">交互逻辑演示 / 示例工程</p><button className="reset-demo" onClick={() => {setState('idle');setDialog(false);}}><ArrowCounterClockwise size={17}/>重新演示</button></div>
    <p className="demo-request">“给选中的人声加一条混响发送，保留原输出。”</p>
    <p className="demo-disclaimer">以下展示产品操作逻辑，不连接 DAW 或模型，不会修改你的文件。</p>
    <div className="transaction-stage">
      <div className="demo-session"><div className="session-label"><span>SESSION / 示例工程</span><span>LOCAL</span></div><div className="session-track"><span>01</span><strong>人声轨</strong><span>输出 → Main</span></div>{tracksChanged && <div className="session-track added"><span>02</span><strong>混响 Aux</strong><span>发送 −12 dB</span></div>}<div className="session-foot">{tracksChanged ? '原输出保留 · 新增一条 Post 发送' : '原工程：一条人声轨，输出到 Main'}</div></div>
      <div className="demo-plan" aria-live="polite"><p className="eyebrow">{stateInfo[state][0]}</p><h3>{stateInfo[state][1]}</h3>
        {state==='idle' ? <p>Agent 初始为只读。先获取轨道、输出路由和工程版本。</p> : ['planned','awaiting','committed','undoing'].includes(state) ? <ol><li>新建混响 Aux</li><li>插入纯湿 Reverb</li><li>保留人声原输出，新增 Post 发送</li><li>整个计划作为一笔事务提交</li></ol> : <p>{state==='inspected' ? '读到的示例事实：选中人声轨，输出为 Main；计划必须使用本次读取的目标与工程版本。' : state==='undone' ? '新增 Aux 与发送已一并撤销。回执状态为 undone。' : '取消尚未提交的计划，不改变原工程。'}</p>}
        <div className="demo-action">{state==='idle' ? <button className="button button-dark" onClick={() => setState('inspected')}>读取示例工程 <ArrowRight size={19}/></button> : state==='inspected' ? <button className="button button-dark" onClick={() => setState('planned')}>生成变更计划 <ArrowRight size={19}/></button> : state==='planned' ? <button className="button button-dark" onClick={e => request('awaiting',e)}>请求提交 <ArrowRight size={19}/></button> : state==='committed' ? <button className="button button-dark" onClick={e => request('undoing',e)}>撤销本次变更 <ArrowCounterClockwise size={18}/></button> : ['cancelled','undone'].includes(state) ? <button className="button button-dark" onClick={() => setState('idle')}>重新开始 <ArrowRight size={19}/></button> : <p className="awaiting-status">等待创作者确认…</p>}</div>
      </div>
    </div>
    {dialog && <div className="demo-dialog-layer"><div className="demo-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" onKeyDown={keyTrap} ref={dialogRef}><p className="eyebrow">LOCAL CONFIRMATION / 示例</p><h3 id="confirm-title">{state==='undoing' ? '撤销这次 Agent 变更？' : '接受并提交这份计划？'}</h3><p id="confirm-description">{state==='undoing' ? '将一并移除本次创建的混响 Aux 与发送，恢复原工程。' : '将新增混响 Aux 与发送，原输出保持不变。你可以在提交后撤销整笔变更。'}</p><div className="dialog-actions"><button className="button button-outline-dark" onClick={() => finish(state==='undoing' ? 'committed' : 'cancelled')}>{state==='undoing' ? '保留变更' : '取消计划'}</button><button className="button button-dark" onClick={() => finish(state==='undoing' ? 'undone' : 'committed')}>{state==='undoing' ? '确认撤销' : '确认并提交'} <Check size={18}/></button></div></div></div>}
    <p className="demo-footnote">设计原则：读真实状态 → 预览计划 → 本地确认 → 真实回执 → 可撤销。</p>
  </div>;
}

function Figure({src,alt,caption}) {
  const [zoom,setZoom]=useState(false);
  const opener=useRef(null),closer=useRef(null);
  useEffect(() => {
    if(!zoom) return;
    const prior=document.body.style.overflow;document.body.style.overflow='hidden';closer.current?.focus();
    const listener=e => {if(e.key==='Escape') setZoom(false);};document.addEventListener('keydown',listener);
    return () => {document.body.style.overflow=prior;document.removeEventListener('keydown',listener);opener.current?.focus();};
  },[zoom]);
  return <><figure className="evidence-figure"><button className="figure-open" aria-label={`放大查看：${alt}`} onClick={() => setZoom(true)} ref={opener}><img src={src} alt={alt} loading="lazy"/><span>放大查看 <ArrowUpRight size={16}/></span></button><figcaption>{caption}</figcaption></figure>{zoom && <div className="lightbox" role="dialog" aria-modal="true" aria-label="项目界面大图" onClick={() => setZoom(false)}><button ref={closer} onClick={() => setZoom(false)} className="lightbox-close icon-button" aria-label="关闭大图" onKeyDown={e => {if(e.key==='Tab') e.preventDefault();}}><X size={26}/></button><img src={src} alt={alt} onClick={e => e.stopPropagation()}/><p>{caption}</p></div>}</>;
}

function Decision({number,title,why,action,result}) {
  return <article className="decision-row"><span className="decision-number">{number}</span><div><h3>{title}</h3><p>{why}</p><dl><div><dt>我的取舍</dt><dd>{action}</dd></div><div><dt>落到产品里</dt><dd>{result}</dd></div></dl></div></article>;
}

function ForgeContent() {
  return <>
    <section id="context" className="case-section"><p className="eyebrow">01 / THE PROBLEM</p><h2>声音生成成功，<br />离游戏响起来还有一段路。</h2><p className="body-large">面向使用 AI 开发游戏的创作者，真正的任务不是获得一个音频文件，而是让合适的声音在正确的时刻发生。</p><p>选择素材、比较候选、调音、管理版本、绑定事件、检查播放，这些环节容易断在不同工具里。我把工作重点放在整条流程的衔接上，让专业音频经验转化成创作者能理解、Agent 能执行的操作。</p><div className="scope-grid"><div><h3>面向谁</h3><p>独立游戏创作者、使用 AI 开发游戏的用户，以及辅助他们工作的 Agent。</p></div><div><h3>我的工作</h3><p>参与音频插件共建，梳理创作与交付流程，推进工作台、Agent 工具与游戏侧接入验证。</p></div></div></section>
    <section id="decisions" className="case-section"><p className="eyebrow">02 / PRODUCT DECISIONS</p><h2>三个取舍，<br />把功能连成工作。</h2>
      <Decision number="01" title="围绕任务设计，贯通创作与交付。" why="生成音乐、音效和语音是不同能力，但创作者最终都需要选定、调整并接入同一个游戏。" action="以声音任务为单位组织入口，用可管理的 Pack 承接制作结果，再把接入作为流程的一部分。" result="工作台连接候选制作、保存、导出与事件绑定；素材不再只是一次生成请求的附件。"/>
      <Decision number="02" title="把创作者的判断留在流程里。" why="模型结果需要比较与改稿。细小的听感修改，不应全部变成重新生成的成本。" action="保留候选与生成历史，提供试听和轻量调音，把原始素材与调整参数分开管理。" result="用户可以比较版本，调整增益、音调和 EQ，再决定保存哪个结果；Agent 与人围绕同一份产物协作。"/>
      <Decision number="03" title="以游戏行为作为交付标准。" why="素材保存成功，不等于事件绑定正确，更不等于进入游戏后能按预期播放与停止。" action="分别验证制作、绑定与运行结果；将定制游戏适配和通用工具能力明确区分。" result="检查开始、循环、停止与静音等状态，保留真实声音输出证据；不把工具回执当作听感验收。"/>
    </section>
    <section id="demo" className="case-section"><p className="eyebrow">03 / WALK THROUGH IT</p><h2>一段声音，怎样进入游戏？</h2><p>点击四个步骤查看完整交付逻辑，也可以试听实际使用的验收素材。</p><ForgeFlow/></section>
    <section id="evidence" className="case-section"><p className="eyebrow">04 / WHAT WAS VERIFIED</p><h2>结果有证据，<br />结论有边界。</h2><div className="verification-strip"><div><strong>0.7.0</strong><span>独立交付候选包</span></div><div><strong>104</strong><span>自动检查通过</span></div><div><strong>16s</strong><span>同一生成素材接入验证</span></div></div><p>2026 年 9 月的功能复测覆盖工作台、在线 BGM 生成与正式游戏模板：同一段 16 秒音乐完成生成、保存、导出、导入与接入，实际播放超过一轮，结束控制后停止。</p><Figure src={sitePath('/assets/forgeax-game.webp')} alt="ForgeaX 游戏音频接入验证的战斗场景" caption="另一组 Engine 0.3.3 定制游戏验证：战斗 BGM 与跳跃音效接入。这里使用起步素材，与 16 秒在线生成素材的正式模板验收分开记录。"/><div className="status-note"><h3>当前验证范围</h3><p>以上是功能与实际输出验证。候选包的正式发布由产品组负责；其他生成服务、人工听感和混音评审，以及不同游戏的适配不能由这组结果直接推定。</p></div><div className="next-question"><span>NEXT QUESTION</span><h3>用户能否更快完成第一次成功接入？</h3><p>下一步希望围绕首次成功播放耗时、候选采用率和改稿次数建立指标，区分“生成完成”与“任务完成”。这些是待采集的指标，不是已实现的增长结果。</p></div></section>
  </>;
}

function FormaContent() {
  return <>
    <section id="context" className="case-section"><p className="eyebrow">01 / THE PROBLEM</p><h2>当 AI 能改工程，<br />创作者如何保持掌控？</h2><p className="body-large">DAW（数字音频工作站）是录音、编辑和混音所在的真实工程环境。让 Agent 参与创作，需要解决的不只是“生成一段音乐”。</p><p>轨道、片段、路由与效果器相互关联，一次模糊操作可能影响整份工程。我为 Forma 定义的核心价值，是让 AI 基于真实工程提出可检查的变更，让创作者能决定、试听并撤销。</p><div className="scope-grid"><div><h3>面向谁</h3><p>需要在已有工程中录音、编辑和混音，并希望 AI 帮忙执行具体任务的音乐创作者。</p></div><div><h3>我的工作</h3><p>个人发起项目，负责产品范围、协作流程与迭代安排，借助 AI 开发原型并组织验证。音频底座复用 Tracktion Engine。</p></div></div></section>
    <section id="decisions" className="case-section"><p className="eyebrow">02 / PRODUCT DECISIONS</p><h2>AI 能做事，<br />也要把事情说清楚。</h2>
      <Decision number="01" title="先读真实工程，再形成操作计划。" why="自然语言没有完整描述选区、路由和轨道状态。只靠意图猜测目标，容易改错对象。" action="Agent 先查询实际工程与命令能力，计划携带本次读取的目标和版本；发生冲突时拒绝执行。" result="界面、脚本与 Agent 共用命令层，操作对象来自工程状态，避免不同入口维护不同规则。"/>
      <Decision number="02" title="把多步操作收束成一笔可审阅变更。" why="创建 Aux、插入混响、调整发送是多步动作，但对创作者来说是一次完整意图。" action="用结构化计划展示影响，由本地确认提交；在同一事务中记录操作，支持整笔撤销。" result="MCP 开发实现包含预览、确认卡片、取消和 Undo。完整外部 Agent 桌面确认与试听仍待人工验收。"/>
      <Decision number="03" title="基础创作保持本地，模型能力按需接入。" why="网络和模型服务不稳定时，录音、编辑与导出仍应可以继续。" action="把音频引擎与网络、推理工作隔开，先验证基础工程能力，再逐步加入智能分析与生成适配。" result="项目以本地原生 DAW 为底座，模型能力作为可选层；各里程碑单独记录完成状态与验证边界。"/>
    </section>
    <section id="demo" className="case-section"><p className="eyebrow">03 / TRY THE INTERACTION</p><h2>走一遍“请求 → 确认 → 撤销”。</h2><p>以给人声建立混响发送为例，体验为什么一次 Agent 操作需要明确的控制与反馈。</p><FormaDemo/><Figure src={sitePath('/assets/forma-review.webp')} alt="Forma 真实开发版本的变更预览界面" caption="开发版本的真实计划预览界面。界面仍保留早期内部名称 NativeDAW。上方交互演示用于说明协作逻辑，不代表完整桌面链路已经验收。"/></section>
    <section id="evidence" className="case-section"><p className="eyebrow">04 / BUILD & VALIDATE</p><h2>先验证底座，<br />再扩展智能能力。</h2><div className="milestones"><div><span>M0</span><div><h3>可行性已通过</h3><p>真实音频导入与播放、命令编辑、Undo / Redo、离线渲染和响度测量已有验证。</p></div><strong>已验证</strong></div><div><span>M1</span><div><h3>基础工作站持续开发</h3><p>Edit / Mix、MIDI、路由、效果器和插件宿主已有功能切片，完整工作站尚未人工验收。</p></div><strong>开发中</strong></div><div><span>M2</span><div><h3>Agent 接口已有开发实现</h3><p>stdio MCP、本地确认与 Undo 有自动覆盖；完整外部 Agent 桌面确认与试听待验收。</p></div><strong>待完整验收</strong></div></div><Figure src={sitePath('/assets/forma-mix.webp')} alt="Forma 开发版本的真实混音界面" caption="真实开发版本的 Mix 界面与音频播放。功能切片的验证不等于完整 DAW 产品已完成。"/><div className="next-question"><span>NEXT QUESTION</span><h3>创作者是否理解每一次计划的影响？</h3><p>下一步关注计划理解程度、确认前修改比例和撤销原因，以真实任务测试审阅界面，而不只看 Agent 命令执行成功率。</p></div><a className="text-link" href="https://github.com/linnn-nb/forma" target="_blank" rel="noreferrer">查看源码与验证文档 <ArrowUpRight size={25}/></a></section>
  </>;
}

export function CaseStudy({project:p}) {
  const [section,setSection]=useState('context');
  useEffect(() => {
    const sections=[...document.querySelectorAll('.case-section')];
    let frame;
    const update=() => {
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(() => {
        let current=sections[0]?.id;
        for(const item of sections) if(item.getBoundingClientRect().top<=Math.max(145,window.innerHeight*.25)) current=item.id;
        if(current) setSection(current);
      });
    };
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
    return () => {cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
  },[]);
  const next=p.id==='forgeax' ? 'forma' : 'forgeax';
  return <main id="main" className={`case-study ${p.theme}`}>
    <section className="case-hero section-pad"><a href={sitePath('/#work')} className="back-link"><ArrowLeft size={19}/>所有作品</a><div className="case-title-row"><div><p className="eyebrow">CASE {p.number} / {p.subtitle}</p><h1>{p.name}</h1></div><span className="case-number">{p.number}</span></div><h2>{p.title}</h2><div className="case-meta"><p><span>我的角色</span>{p.role}</p><p><span>当前进度</span>{p.status}</p></div><Figure src={p.image} alt={`${p.name} 真实开发界面`} caption={p.id==='forma' ? 'Forma Studio 真实开发界面，当前截图保留内部名称 NativeDAW。' : '声音工坊交付候选版的真实工作台。'}/></section>
    <div className="case-body section-pad"><aside className="case-toc"><span className="eyebrow">INSIDE THE CASE</span><nav aria-label="案例目录">{[['context','01','问题与角色'],['decisions','02','关键产品取舍'],['demo','03','体验工作流'],['evidence','04','实现与验证']].map(([id,n,title]) => <a key={id} href={`#${id}`} aria-current={section===id ? 'location' : undefined}><span>{n}</span>{title}</a>)}</nav><a href={sitePath('/#work')} className="back-link"><ArrowLeft size={16}/>返回作品</a></aside><div className="case-content">{p.id==='forgeax' ? <ForgeContent/> : <FormaContent/>}</div></div>
    <a className="next-project section-pad" href={sitePath(`/work/${next}`)}><div><p className="eyebrow">NEXT CASE / {next==='forma' ? '02' : '01'}</p><h2>{next==='forma' ? 'Forma Studio' : 'ForgeaX'}</h2><p>{next==='forma' ? '让 AI 进入工程，也让创作者握住控制权。' : '从一个声音，到一个能响起来的游戏。'}</p></div><ArrowUpRight size={68}/></a>
  </main>;
}
