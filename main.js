let news = []
let page = 1
let totalPages = 0
const menus = document.querySelectorAll('.menus button')
menus.forEach((menu) => menu.addEventListener('click', (event) => getNewsByTopic(event)))
let searchBtn = document.getElementById('search-button');
let url 

// 각 함수에서 필요한 url을 만든다
// api 호출 함수를 부른다

const getNews = async () => {
  try{
    let header = new Headers({'x-api-key' : 'FdItlp8cfxTBbZ53Q9wX4YQh8Yz5FVCKeR6u77c0y2o'})

    url.searchParams.set('page', page)    // page추가 page=?
    console.log(url)
    let response = await fetch(url, {headers:header}) //ajax, http, fetch
    let data = await response.json()  //서버통신에서 많이 쓰이는 데이터 타입
    if(response.status == 200) {
      if(data.total_hits == 0)  {
        throw new Error('검색된 결과값이 없습니다.')
      }
      console.log('받은 데이터는', data)
      news= data.articles
      totalPages = data.total_pages
      page = data.page
      console.log(news)
      render()
      pagination()
    } else{
      throw new Error(data.message)
    }  
  } catch (error){
    console.log('잡힌 에러는', error.message)
    errorRender(error.message)
  }
}

const getLatestNews = async() => {    //async : 함수에서 비동기처리  (await과 세트)
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  )
  getNews()
}

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase()
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
  getNews()

}

const getNewsByKeyword = async() => {
  // 1.검색키워드 읽어오기
  // 2.url에 검색키워드 붙이기
  // 3.header 준비
  // 4.url 부르기
  // 5. 데이터 가져오기
  // 6. 데이터 보여주기

  let keyword = document.getElementById('search-input').value
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  )
  getNews()

}

const render = () => {
  let newsHtml = ''
  newsHtml = news.map(item => {
    return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size"
        src="${item.media}" alt="img" />
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <div>
      ${item.rights} * ${item.published_date}
      </div>
    </div>
  </div>`
  }).join('')

  document.getElementById('news-board').innerHTML = newsHtml
}

const errorRender = (message) => {
  let errorHtml = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
  document.getElementById('news-board').innerHTML = errorHtml
}

const pagination = () => {
  let paginationHtml = ''
  // total_page
  // page
  // page group
  let pageGroup = Math.ceil(page / 5)
  // last
  let last = pageGroup * 5
  // first
  let first = last - 4
  // first ~ last 페이지 프린트

  //total page 3일 경우, 페이지만 프린트 하는 법
  // << >> 만들어 주기 - 맨처음/맨끝 이동 버튼
  // 내가 그룹1일 때, << < 버튼 없애주기
  // 내가 마지막 그룹일 때, > >> 버튼 없애주기

  paginationHtml = ` <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`

  for(let i=first; i<last; i++) {
    paginationHtml += `<li class="page-item ${page === i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
  }

  
  paginationHtml += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`


  document.querySelector('.pagination').innerHTML = paginationHtml
}

const moveToPage = (pageNum) => {
  // 1. 이동할 페이지 알아야한다
  page = pageNum
  // 2. 이동할 페이지를 가지고 api 다시 호출
  getNews()
}

searchBtn.addEventListener('click', getNewsByKeyword)   // 함수표현은 호이스팅X : 위치중요
getLatestNews()