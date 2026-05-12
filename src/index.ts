import { Hono } from 'hono'
import { jwt } from 'hono/jwt'

const app = new Hono()
const JWT_SECRET = '8s9kP2xR7tG5bN3mQ6wA1zC4dF7hJ2kL5'

// 首页
app.get('/', async (c) => {
  return c.html(`
    <h1>简易轻量论坛</h1>
    <p><a href="/login">登录</a> | <a href="/register">注册</a></p>
    <p><a href="/posts">帖子列表</a></p>
  `)
})

// 注册
app.get('/register', (c) => c.html(`
  <h2>注册账号</h2>
  <form method="post" action="/do-register">
    <input name="email" placeholder="邮箱" /><br>
    <input name="pwd" placeholder="密码" type="password" /><br>
    <button type="submit">注册</button>
  </form>
`))

// 登录
app.get('/login', (c) => c.html(`
  <h2>登录</h2>
  <form method="post" action="/do-login">
    <input name="email" placeholder="邮箱" /><br>
    <input name="pwd" placeholder="密码" type="password" /><br>
    <button type="submit">登录</button>
  </form>
`))

// 帖子列表
app.get('/posts', async (c) => {
  const list = await c.env.DB.get('post-list') || '暂无帖子'
  return c.html(`
    <h2>帖子列表</h2>
    <p>${list}</p>
    <p><a href="/new-post">发新帖</a></p>
  `)
})

// 发新帖页面
app.get('/new-post', (c) => c.html(`
  <h2>发布新帖子</h2>
  <form method="post" action="/do-post">
    <input name="title" placeholder="标题" /><br>
    <textarea name="content" placeholder="内容"></textarea><br>
    <button type="submit">发布</button>
  </form>
`))

// 提交发帖
app.post('/do-post', async (c) => {
  const body = await c.req.parseBody()
  const title = String(body.title || '')
  const content = String(body.content || '')

  let list = await c.env.DB.get('post-list') || ''
  list += `<div><h3>${title}</h3><p>${content}</p><hr></div>`
  await c.env.DB.put('post-list', list)

  return c.redirect('/posts')
})

export default app
