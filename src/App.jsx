import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowLeft, List, X, Copy, Check, GithubLogo } from '@phosphor-icons/react';
import { CaseStudy } from './CaseStudy';
import { sitePath, routePath } from './paths.mjs';

export const projects = [
  { id: 'forgeax', number: '01', name: 'ForgeaX', subtitle: '音频插件 · 声音工坊', title: '从一个声音，到一个能响起来的游戏。', summary: '把生成、试听、调音与游戏接入，组织成创作者和 AI 共用的工作流。', image: sitePath('/assets/forgeax-workbench.webp'), theme: 'sage', role: '开源共建 / 产品设计与工作流实现', status: '交付候选版 · 已有功能验证', tags: ['AI 工作流', '人机协作', '游戏音频'] },
  { id: 'forma', number: '02', name: 'Forma Studio', subtitle: 'AI 原生数字音频工作站', title: '让 AI 进入工程，也让创作者握住控制权。', summary: '设计基于真实工程的 Agent 操作，让每次变更都能审阅、试听和撤销。', image: sitePath('/assets/forma-edit.webp'), theme: 'lilac', role: '个人项目 / 产品定义与 AI 辅助开发', status: '早期开发 · M0 可行性通过', tags: ['AI Native', '复杂工具', '可审阅操作'] },
];

function Header({ home }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  useEffect(() => {
    const close = (e) => { if (e.key === 'Escape' && open) { setOpen(false); button.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  const root = home ? '' : sitePath('/');
  return <header className="site-header">
    <a className="identity" href={sitePath('/')} aria-label="胡锦霖，返回首页"><strong>JINLIN HU <span>/ 胡锦霖</span></strong><small>AI PRODUCT MANAGER</small></a>
    <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="主导航" id="main-nav">
      <a href={`${root}#work`} onClick={() => setOpen(false)}>作品 <span>02</span></a>
      <a href={`${root}#about`} onClick={() => setOpen(false)}>关于</a>
      <a href={`${root}#contact`} onClick={() => setOpen(false)}>联系</a>
      <a className="button button-cream nav-resume" href={sitePath('/downloads/jinlin-hu-resume.pdf')} download="胡锦霖_简历.pdf">简历 <ArrowUpRight size={21} aria-hidden="true" /></a>
    </nav>
    <button className="menu-toggle icon-button" aria-label={open ? '关闭导航' : '打开导航'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)} ref={button}>{open ? <X size={24} /> : <List size={24} />}</button>
  </header>;
}

function Hero() {
  const art = useRef(null);
  const [moving, setMoving] = useState(true);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function move(e) {
    if (!moving || reduced || !art.current || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    art.current.style.setProperty('--pointer-x', `${(e.clientX - rect.left - rect.width / 2) / rect.width * 16}px`);
    art.current.style.setProperty('--pointer-y', `${(e.clientY - rect.top - rect.height / 2) / rect.height * 12}px`);
  }
  return <section className={`hero ${moving && !reduced ? 'motion-on' : ''}`} onPointerMove={move} aria-labelledby="hero-title">
    <div className="hero-art" ref={art}><img src={sitePath('/assets/sound-reel.webp')} width="1254" height="1254" alt="" fetchPriority="high" /></div>
    <div className="hero-main">
      <h1 id="hero-title"><span>SOUND TO</span><span className="pink">SYSTEMS.</span></h1>
      <div className="hero-intro"><p className="hero-byline">胡锦霖 <span>·</span> AI 产品经理 <span>·</span> 2027 届</p>
        <p className="hero-copy">从音乐创作出发，设计人与 AI 协作的工具。<br />把真实问题，做成可以使用、验证和迭代的产品。</p>
        <div className="hero-actions"><a href="#work" className="button button-cream">探索作品 <ArrowRight size={23} /></a><a href="#about" className="button button-outline">认识我</a></div>
      </div>
    </div>
    <div className="hero-bottom"><div className="hero-projects"><a href={sitePath('/work/forgeax')}><span>01</span> ForgeaX 音频工作台 <ArrowUpRight size={17} /></a><a href={sitePath('/work/forma')}><span>02</span> Forma Studio <ArrowUpRight size={17} /></a></div>
      <button className="motion-toggle" onClick={() => { setMoving(!moving); art.current?.style.setProperty('--pointer-x', '0px'); art.current?.style.setProperty('--pointer-y', '0px'); }} aria-pressed={moving && !reduced} disabled={reduced}>{reduced ? '已减少动效' : moving ? '暂停动效' : '开启动效'}</button>
    </div>
  </section>;
}

function SelectedWorks() {
  const [active, setActive] = useState(0);
  const p = projects[active];
  return <section id="work" className="selected-work section-pad" aria-labelledby="works-title">
    <div className="section-heading reveal"><div><p className="eyebrow">SELECTED WORK / 2026</p><h2 id="works-title">想法，<span>落进真实工程。</span></h2></div><p className="section-index"><strong>02</strong><span>PROJECTS</span></p></div>
    <div className="work-reel reveal">
      <div className="work-detail" key={p.id}>
        <p className="eyebrow">{p.number} / {p.subtitle}</p><h3>{p.name}</h3><p className="work-line">{p.title}</p><p className="work-summary">{p.summary}</p><div className="project-tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
        <a className="text-link" href={sitePath(`/work/${p.id}`)}>进入产品案例 <ArrowUpRight size={28} /></a>
      </div>
      <div className={`reel-stage ${p.theme}`}>
        <div className="reel-label"><span>THE WORK REEL</span><span>{p.number} / 02</span></div>
        <a className="screen-paper" href={sitePath(`/work/${p.id}`)} key={p.id} aria-label={`查看 ${p.name} 产品案例`}><img src={p.image} width={p.id === 'forgeax' ? '1440' : '2880'} height={p.id === 'forgeax' ? '900' : '1864'} alt={`${p.name} 的真实开发界面`} loading="lazy" /><div className="screen-caption"><span>{p.name.toUpperCase()}</span><span>真实开发界面 <ArrowUpRight size={18} /></span></div></a>
        <p className="reel-footnote">{p.status}</p>
      </div>
    </div>
    <div className="reel-controls reveal" aria-label="切换展示项目">
      <div role="group" aria-label="作品选择">{projects.map((project, i) => <button key={project.id} aria-pressed={i === active} className={i === active ? 'active' : ''} onClick={() => setActive(i)}><span>{project.number}</span> {project.name}<ArrowUpRight size={19} /></button>)}</div>
      <div className="reel-arrows"><button className="icon-button" aria-label="上一个作品" onClick={() => setActive((active + 1) % 2)}><ArrowLeft size={22} /></button><button className="icon-button" aria-label="下一个作品" onClick={() => setActive((active + 1) % 2)}><ArrowRight size={22} /></button></div>
    </div>
  </section>;
}

function ProductLens() {
  return <section className="product-lens section-pad" aria-labelledby="lens-title">
    <div className="lens-intro reveal"><p className="eyebrow">MY PRODUCT LENS</p><h2 id="lens-title">好用的 AI，<br />要进入真实工作。</h2><p>音乐是我的起点。问题定义、工具设计和工程验证，是我希望带进更多产品的能力。</p></div>
    <div className="lens-rows">
      {[['01', '先找到任务，再定义功能。', '从创作者如何开始、在哪里卡住、怎样判断完成，拆出值得解决的问题。'], ['02', '让 AI 能执行，让人能判断。', '把自然语言意图变成有边界的操作；保留预览、选择、确认与修正的机会。'], ['03', '用真实结果推动下一次迭代。', '既看界面是否好用，也检查产物能否进入工程、产生预期行为。']].map(([n,title,body]) => <div className="lens-row reveal" key={n}><span>{n}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight className="lens-arrow" size={29} aria-hidden="true" /></div>)}
    </div>
  </section>;
}

const aboutNotes = [
  {name:'产品', text:'我喜欢把复杂的专业工具，拆成清楚的任务、反馈与控制。ForgeaX 和 Forma 是我用实际项目练习产品判断的方式。'},
  {name:'音乐', text:'录音工程训练让我习惯在创作现场发现问题：候选是否合适、参数如何影响听感、声音最终在哪个时刻发生。'},
  {name:'工程', text:'我用 Codex 等 AI 工具实现原型、连接音频工作站并验证交付。既关注模型能做什么，也关注操作怎样进入真实工程。'},
];

function About() {
  const [note,setNote] = useState(0);
  return <section id="about" className="about section-pad" aria-labelledby="about-title">
    <div className="about-workspace reveal"><p className="eyebrow">A LITTLE ABOUT ME</p><h2 id="about-title">我的起点，<br />是一张创作桌。</h2>
      <div className="studio-scene"><img src={sitePath('/assets/studio-sketch.webp')} alt="铅笔手绘的创作桌：音箱、键盘、耳机与一本笔记" width="1448" height="1086" loading="lazy" /><div className="studio-points">{aboutNotes.map((n,i) => <button className={`studio-point point-${i} ${note === i ? 'selected' : ''}`} onClick={() => setNote(i)} aria-pressed={note === i} key={n.name}>{n.name} <ArrowUpRight size={15}/></button>)}</div></div>
      <div className="studio-note" aria-live="polite"><span>{aboutNotes[note].name} /</span><p>{aboutNotes[note].text}</p></div>
    </div>
    <div className="about-story reveal"><p className="about-lead">我叫胡锦霖，<br />正在从音乐创作走向 AI 产品。</p><p className="about-body">我在录音、编曲和游戏音频实践里理解创作者，也通过产品原型和工程实现，探索怎样让 AI 真正参与工作。希望做的产品，既懂人的意图，也尊重人的判断。</p>
      <div className="experience-list">
        <div><p className="experience-date">2023.09 — 2027.06</p><h3>星海音乐学院</h3><p>录音工程 · 本科 · 预计 2027 年 6 月毕业</p></div>
        <div><p className="experience-date">2026.07 — 至今</p><h3>腾讯 · 光子工作室群</h3><p>音频策划实习 · 音频工具与游戏创作流程</p></div>
        <div><p className="experience-date">2026.01 — 2026.03</p><h3>太合音乐 · GVO 对厂牌</h3><p>音乐制作实习 · 编曲与商业音乐制作</p></div>
      </div>
      <a className="text-link" href={sitePath('/downloads/jinlin-hu-resume.pdf')} download="胡锦霖_简历.pdf">下载完整简历 <ArrowDown size={24}/></a>
    </div>
  </section>;
}

export function Contact({ compact = false }) {
  const [copied,setCopied] = useState(false);
  const [error,setError] = useState(false);
  const timer=useRef(null);
  useEffect(() => () => clearTimeout(timer.current),[]);
  async function copy() {
    try { await navigator.clipboard.writeText('3455273790@qq.com'); setCopied(true); setError(false); clearTimeout(timer.current); timer.current=setTimeout(() => setCopied(false),2400); }
    catch {setError(true);}
  }
  return <footer id="contact" className={`contact section-pad ${compact ? 'compact' : ''}`}>
    <div className="contact-top"><p className="eyebrow">LET’S BUILD SOMETHING THAT WORKS.</p><a href="#top" className="back-top">回到顶部 <ArrowUpRight size={19}/></a></div>
    <h2>MAKE IT<br /><span className="pink">REAL.</span></h2>
    <div className="contact-bottom"><div><p>正在寻找 AI 产品经理机会 · 2027 届</p><div className="email-row"><a href="mailto:3455273790@qq.com">3455273790@qq.com <ArrowUpRight size={24}/></a><button className="icon-button" onClick={copy} aria-label={copied ? '邮箱已复制' : '复制邮箱'}>{copied ? <Check size={21}/> : <Copy size={21}/>}</button><span className="copy-feedback" role="status">{copied ? '已复制' : error ? '请选中邮箱手动复制' : ''}</span></div></div>
      <div className="contact-links"><a href="https://github.com/linnn-nb" target="_blank" rel="noreferrer"><GithubLogo size={20}/> GitHub <ArrowUpRight size={18}/></a><a href={sitePath('/downloads/jinlin-hu-resume.pdf')} download="胡锦霖_简历.pdf">简历 <ArrowDown size={18}/></a></div>
    </div>
    <div className="footer-meta"><span>© 2026 JINLIN HU</span><span>从声音，到产品。</span><span>DESIGNED WITH INTENTION.</span></div>
  </footer>;
}

function useReveals() {
  useEffect(() => {
    const observer=new IntersectionObserver((entries) => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }}),{threshold:0.08});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  },[]);
}

export function App() {
  const path=routePath(window.location.pathname);
  const project=projects.find(p => path === `/work/${p.id}`);
  const home=path === '';
  useReveals();
  useEffect(() => { document.title=project ? `${project.name} · 产品案例 — 胡锦霖` : '胡锦霖 · AI 产品经理 | Sound to Systems'; },[project]);
  return <div id="top"><a className="skip-link" href="#main">跳到主要内容</a><Header home={home}/>
    {project ? <><CaseStudy project={project}/><Contact compact/></> : home ? <><main id="main"><Hero/><SelectedWorks/><ProductLens/><About/></main><Contact/></> : <main id="main" className="not-found section-pad"><p className="eyebrow">404 / NOT ON THIS REEL</p><h1>这里还没有作品。</h1><a className="button button-dark" href={sitePath('/')}>返回首页 <ArrowRight size={20}/></a></main>}
  </div>;
}
