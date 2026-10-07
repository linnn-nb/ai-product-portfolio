# 胡锦霖 · AI 产品经理作品集

个人网站：通过 ForgeaX 音频插件与 Forma Studio 展示问题定义、AI 工作流设计、产品实现与验证。

GitHub Pages 地址：https://linnn-nb.github.io/ai-product-portfolio/

## 页面

- `/`：定位、作品切换、产品视角、交互式创作桌、教育与实习、联系。
- `/work/forgeax`：声音制作到游戏交付的案例；四步流程导览与真实音频试听。
- `/work/forma`：原生 DAW 与 Agent 协作的案例；示例工程的查询、计划、确认、取消与整笔撤销。

Forma 的网页演示是交互逻辑示意，不连接真实 DAW、模型或用户文件。项目截图来自真实开发版本。业务增长指标没有杜撰；后续指标明确列为待采集。

## 开发与验证

使用 Node 20.19+ 或 22.12+：

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
npm run build
npm run test:sites
PAGES_BASE_PATH=/ai-product-portfolio/ npm run build:pages
PAGES_BASE_PATH=/ai-product-portfolio/ npm run test:pages
```

静态客户端位于 `dist/client`。Pages 构建会为两篇案例生成独立目录入口，直接打开或刷新案例地址均可工作。`.github/workflows/pages.yml` 在 main 更新后自动构建、检查并发布；部署路径来自 Pages 配置，支持账号主页或项目子目录。

源码同时保留 Sites Worker 与元数据，位于 `dist/server/index.js`、`dist/.openai/hosting.json`。GitHub Pages 只发布静态客户端。

## 编辑入口

- `src/App.jsx`：首页、个人信息、联系方式、项目简介。
- `src/CaseStudy.jsx`：案例内容与演示交互。
- `src/styles.css`：版式、颜色、响应式与减少动效。
- `public/assets/`：真实产品截图、原创新生成插画、实际音乐素材、本地字体。
- `public/downloads/jinlin-hu-resume.pdf`：用户已有的排版优化版简历。
- `src/paths.mjs`：静态资源与案例路径的子目录适配。
- `scripts/prepare-pages-build.mjs`：GitHub Pages 静态入口。
- `.github/workflows/pages.yml`：自动构建与发布。

本地研究、设计基准、检查记录及源插画未上传到此仓库。

界面图与原创新生成插画保留各自来源。Archivo 字体遵循 SIL Open Font License，许可见 `public/assets/fonts/OFL-Archivo.txt`；图标使用 `@phosphor-icons/react`，许可见依赖包。页面默认不自动播放音频，支持键盘和系统减少动效设置。
