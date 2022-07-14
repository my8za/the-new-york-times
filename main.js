let news = []
let menus = document.querySelectorAll('.menus button')
menus.forEach(menu => 
  menu.addEventListener('click', (event) => getNewsByTopic(event)))
const getLatestNews = async() => {
  // async : 비동기처리
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
    )
  let header = new Headers({'x-api-key':'FdItlp8cfxTBbZ53Q9wX4YQh8Yz5FVCKeR6u77c0y2o'})

  let response = await fetch(url, {headers:header})
  let data = await response.json()
  news = data.articles
  console.log(news)

  render()
}

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase()
  let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KRpage_size=10&topic=${topic}`)
  let header = new Headers({'x-api-key':'FdItlp8cfxTBbZ53Q9wX4YQh8Yz5FVCKeR6u77c0y2o'})
  let response = await fetch(url, {headers:header})
  let data = await response.json()
  news = data.articles

  render()
}

const render = () => {
  let newsHtml = ''
  newsHtml = news.map((item) => {
    return `<div class="row news">
      <div class="col-lg-4"><img class="news-img-size"src="${item.media}" /></div>
      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>${item.summary}</p>
        <div>${item.rights} * ${item.published_date}</div>
      </div>
    </div>`
  }).join('')

  document.getElementById('news-board').innerHTML = newsHtml
}

getLatestNews()