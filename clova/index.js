const arrayShuffle = require('array-shuffle')
const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN, ExtensionId, DEBUG } = require('../config')
var verifier = require('../util/verifier.js')
var LRU = require('lru-cache')
  , options = { max: 500
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , cache = new LRU(options)

const FUDA = 
  ['秋の田の　かりほの庵の　苫woarami　わが衣手は　つゆにぬれつつ',
  '春すぎて　夏きにけらし　白妙の。衣hosucyou　あまのカグヤマ',
  'あしびきの　山鳥の尾の　しだり尾の　ながながし夜を　ひとりかもねむ',
  '田子の浦に　うちでてみれば　白妙の　富士の高嶺に　雪はふりつつ',
  '奥山に　もみじ踏みわけ　鳴く鹿の　声きく時ぞ　秋は悲しき',
  'かささぎの　渡せる橋に　おく霜の　白きをみれば　よぞふけにける',
  'あまの原　ふりさけ見れば　かすがなる　三笠の山に　いでし月かも',
  'わが庵は　みやこのたつみ　しかぞすむ　世をうぢヤマと　人はいふなり',
  '花の色は　うつりにけりな　いたづらに　わがよにふる　ながめせしまに',
  'これやこの　行くも帰るも　別れては　知るも知らぬも　逢坂の関',
  'わたのはら　やそしまかけて　漕ぎいでぬと　人には告げよ　あまの釣舟', 
  '天つ風　雲のかよいじ　吹きとじよ　をとめの姿　しばしとどめん',
  '筑波嶺の　峰より落つる　みなの川　恋ぞつもりて　淵となりぬる',
  '陸奥の　しのぶもぢずり　誰ゆゑに　乱れそめにし　われならなくに',
  '君がため　春の野に出でて　若菜つむ　わが衣手に　雪はふりつつ',
  'たち別れ　いなばの山の　峰におふる　まつとし聞かば　今帰りこむ',
  'ちはやぶる　かみよも聞かず　竜田がわ　からくれなゐに　水くくるとは',
  'すみの江の　岸による波　よるさへや　夢のかよひじ　ひとめよくらむ',
  'なにわがた　みじかき芦の　ふしの間も　逢はでこの世を　すぐしてよとや',
  'わびぬれば　今はた同じ　なにわなる　みをつくしても　逢はむとぞ思ふ',
  'いまこんと　言ひしばかりに　長月の　有明の月を　待ちいでつるかな',
  '吹くからに　秋の草木の　しをるれば　むべ山風を　嵐といふらん',
  '月見れば　ちぢにものこそ　悲しけれ　わが身一つの　秋にはあらねど',
  'このたびは　ぬさもとりあへず　たむけやま　もみじの錦　神のまにまに',
  '名にしおわば　おうさかやまの　さねかづら　人にしられで　くるよしもがな',
  '小倉山　峰のもみぢ葉　心あらば　今ひとたびの　みゆき待たなん',
  'みかの原　わきて流るる　泉川　いつ見きとてか　恋しかるらん',
  '山里は　冬ぞさびしさ　まさりける　人目も草も　かれぬと思へば',
  '心あてに　折らばや折らむ　初しもの　置きまどわせる　白菊の花',
  '有明の　つれなく見えし　別れより　あかつきばかり　うきものはなし',
  '朝ぼらけ　有明の月と　見るまでに　吉野の里に　ふれる白雪',
  '山川に　風のかけたる　しがらみは　流れもあえぬ　もみじなりけり',
  'ひさかたの　光のどけき　春の日に　しず心なく　花の散るらん',
  '誰をかも　知る人にせん　高砂の　松も昔の　友ならなくに',
  '人はいさ　心も知らず　ふるさとは　花ぞ昔の　かににほひける',
  '夏のよは　まだよいながら　明けぬるを　雲のいづこに　月宿るらん',
  'しらつゆに　風の吹きしく　秋の野は　つらぬきとめぬ　玉ぞ散りける',
  '忘らるる　身をば思はず　ちかひてし　人の命の　惜しくもあるかな',
  'あさじうの　小野の篠原　しのぶれど　あまりてなどか　人の恋しき',
  'しのぶれど　色に出でにけり　わが恋は　物や思ふと　人の問ふまで',
  '恋すちょう　わが名はまだき　立ちにけり　人知れずこそ　思ひそめしか',
  '契りきな　かたみに袖を　しぼりつつ　すえの松山　波こさじとは',
  'あひ見ての　のちの心に　くらぶれば　昔は物を　思はざりけり',
  'あふことの　絶えてしなくは　なかなかに　人をも身をも　恨みざらまし',
  'あはれとも　いふべき人は　思ほえで　身のいたづらに　なりぬべきかな',
  'ゆらのとを　渡る舟人　かぢを絶え　ゆくへも知らぬ　恋の道かな',
  '八重葎　しげれる宿の　さびしきに　人こそ見えね　秋は来にけり',
  '風をいたみ　岩うつ波の　おのれのみ　くだけて物を　思ふころかな',
  'みかきもり　えじのたく火の　夜は燃え　昼は消えつつ　物をこそ思へ',
  '君がため　惜しからざりし　命さへ　長くもがなと　思ひけるかな',
  'かくとだに　えやはいぶきの　さしも草　さしも知らじな　燃ゆる思ひを',
  '明けぬれば　暮るるものとは　知りながら　なほうらめしき　朝ぼらけかな',
  '嘆きつつ　ひとり寝る夜の　明くる間は　いかに久しき　ものとかは知る',
  '忘れじの　行く末までは　かたければ　今日を限りの　命ともがな',
  '滝の音は　絶えて久しく　なりぬれど　名こそ流れて　なほ聞こえけれ',
  'あらざらむ　この世のほかの　思ひ出に　今ひとたびの　あふこともがな',
  'めぐりあひて　見しやそれとも　わかぬ間に　雲がくれにし　よはの月かな',
  '有馬山　いなのささはら　風吹けば　いでそよ人を　忘れやはする',
  'やすらはで　寝なましものを　さよふけて　かたぶくまでの　月を見しかな',
  '大江山　いく野の道の　遠ければ　まだふみもみず　あまの橋立',
  'いにしへの　奈良のみやこの　八重桜　きょう九重に　にほひぬるかな',
  '夜をこめて　鳥のそらねは　はかるとも　よにおうさかの　せきはゆるさじ',
  '今はただ　思ひ絶えなむ　とばかりを　人づてならで　言ふよしもがな',
  '朝ぼらけ　宇治の川ぎり　たえだえに　あらはれわたる　瀬々の網代木',
  '恨みわび　ほさぬ袖だに　あるものを　恋にくちなん　名こそ惜しけれ',
  'もろともに　あはれと思へ　山桜　花よりほかに　知る人もなし',
  '春の夜の　夢ばかりなる　たまくらに　かひなく立たむ　名こそ惜しけれ',
  '心にも　あらでうき世に　ながらへば　恋しかるべき　よはの月かな',
  '嵐吹く　みむろの山の　もみぢ葉は　竜田の川の　錦なりけり',
  'さびしさに　宿を立ち出でて　ながむれば　いづこも同じ　秋の夕暮れ',
  '夕されば　門田の稲葉　おとづれて　芦のまろやに　秋風ぞ吹く',
  '音に聞く　高師の浜の　あだ波は　かけじや袖の　ぬれもこそすれ',
  '高砂の　おの上の桜　咲きにけり　とやまのかすみ　立たずもあらなむ',
  'うかりける　人をはつせの　山おろしよ　はげしかれとは　祈らぬものを',
  'ちぎりおきし　させもがつゆを　命にて　あはれ今年の　秋もいぬめり',
  'わたの原　漕ぎいでて見れば　ひさかたの　くもいにまがふ　沖つ白波',
  '瀬をはやみ　岩にせかるる　滝川の　われても末に　あはむとぞ思ふ',
  '淡路島　かよふ千鳥の　鳴く声に　いく夜寝覚めぬ　すまのせきもり',
  '秋風に　たなびく雲の　絶え間より　もれ出づる月の　影のさやけさ',
  '長からん　心も知らず　黒髪の　乱れて今朝は　物をこそ思へ',
  'ほととぎす　なきつるかたを　ながむれば　ただ有明の　月ぞ残れる',
  '思ひわび　さても命は　あるものを　うきにたへぬは　涙なりけり',
  '世の中よ　道こそなけれ　思ひ入る　山の奥にも　鹿ぞ鳴くなる',
  'ながらへば　またこのごろや　しのばれむ　うしとみしよぞ　今は恋しき',
  '夜もすがら　物思ふころは　明けやらで　ねやのひまさへ　つれなかりけり',
  'なげけとて　月やは物を　思はする　かこち顔なる　わが涙かな',
  'むらさめの　つゆもまだひぬ　まきの葉に　きり立ちのぼる　秋の夕暮れ',
  'なにわえの　芦のかりねの　ひとよゆゑ　みをつくしてや　こひわたるべき',
  '玉の緒よ　たえなばたえね　ながらへば　しのぶることの　よわりもぞする',
  '見せばやな　おしまのあまの　袖だにも　ぬれにぞぬれし　色はかはらず',
  'きりぎりす　鳴くやしもよの　さむしろに　ころもかたしき　ひとりかも寝む',
  'わが袖は　潮干に見えぬ　沖の石の　人こそ知らね　かわく間もなし',
  '世の中は　常にもがもな　渚こぐ　あまの小舟の　つなでかなしも',
  'み吉野の　山の秋風　さ夜更けて　ふるさと寒く　衣うつなり',
  'おほけなく　うき世の民に　おおうかな　わが立つ杣に　墨染の袖',
  '花さそふ　嵐の庭の　雪ならで　ふりゆくものは　わが身なりけり',
  'こぬ人を　まつほの浦の　夕なぎに　焼くや藻塩の　身もこがれつつ',
  '風そよぐ　ならの小川の　夕暮れは　みそぎぞ夏の　しるしなりける',
  '人も惜し　人も恨めし　あぢきなく　世を思ふゆゑに　物思ふ身は',
  'ももしきや　古き軒端の　しのぶにも　なほあまりある　昔なりけり'
]

class Directive {
  constructor({namespace, name, payload}) {
    this.header = {
      messageId: uuid(),
      namespace: namespace,
      name: name,
    }
    this.payload = payload
  }
}

class CEKRequest {
  constructor (httpReq) {
    this.request = httpReq.body.request
    this.context = httpReq.body.context
    this.session = httpReq.body.session
    console.log(`CEK Request: ${JSON.stringify(this.context)}, ${JSON.stringify(this.session)}`)
  }

  do(cekResponse) {
    switch (this.request.type) {
      case 'LaunchRequest':
        return this.launchRequest(cekResponse)
      case 'IntentRequest':
        return this.intentRequest(cekResponse)
      case 'SessionEndedRequest':
        return this.sessionEndedRequest(cekResponse)
    }
  }

  launchRequest(cekResponse) {
    console.log('launchRequest')
    var cached = cache.get(this.session.user.userId)​
    if (cached != null) {
      cekResponse.setMultiturn({order : cached.order, index : cached.index});
    } else {
      order = [...Array(100).keys()];
      cekResponse.setMultiturn({order : order, index : 0});
    }
    cekResponse.appendSpeechText(FUDA[order[index]])
  }

  intentRequest(cekResponse) {
    console.log('intentRequest')
    console.dir(this.request)
    const intent = this.request.intent.name
    const slots = this.request.intent.slots
    var index = null
    var order = null

    console.log(this.session.sessionAttributes.order)
    order = this.session.sessionAttributes.order
    index = this.session.sessionAttributes.index
    
    switch (intent) {
    case 'NextIntent':
      if (index >= 99){
        cekResponse.appendSpeechText(`もう読む札がありません`)
        break
      } else {
        index++;
      }
      cekResponse.appendSpeechText(FUDA[order[index]])
      break
    case 'RepeatIntent':
      cekResponse.appendSpeechText(FUDA[order[index]])
      break
    case 'Clova.GuideIntent': 
    default: 
      cekResponse.setSimpleSpeechText("次のフダを読む場合は、次へ、同じフダを読む場合は、もう一度と言ってください") 
    }
    cekResponse.setMultiturn({"order" : order, index : index})
    cache.set(this.session.user.userId​, {"order" : order, "index" : index})
  }

  sessionEndedRequest(cekResponse) {
    console.log('sessionEndedRequest')
    cekResponse.clearMultiturn()
  }
}

class CEKResponse {
  constructor () {
    console.log('CEKResponse constructor')
    this.response = {
      directives: [],
      shouldEndSession: true,
      outputSpeech: {},
      card: {},
    }
    this.version = '0.1.0'
    this.sessionAttributes = {}
  }

  setMultiturn(sessionAttributes) {
    this.response.shouldEndSession = false
    this.sessionAttributes = _.assign(this.sessionAttributes, sessionAttributes)
  }

  clearMultiturn() {
    this.response.shouldEndSession = true
    this.sessionAttributes = {}
  }

  setSimpleSpeechText(outputText, lang = 'ja') {
    this.response.outputSpeech = {
      type: 'SimpleSpeech',
      values: {
          type: 'PlainText',
          lang: lang,
          value: outputText,
      },
    }
  }

  appendSpeechText(outputText) {
    const outputSpeech = this.response.outputSpeech
    if (outputSpeech.type != 'SpeechList') {
      outputSpeech.type = 'SpeechList'
      outputSpeech.values = []
    }
    if (typeof(outputText) == 'string') {
      outputSpeech.values.push({
        type: 'PlainText',
        lang: 'ja',
        value: outputText,
      })
    } else {
      outputSpeech.values.push(outputText)
    }
  }
}

const clovaReq = function (httpReq, httpRes, next) {
  const signature = httpReq.headers.signaturecek
  var cekResponse = new CEKResponse()
  var cekRequest = new CEKRequest(httpReq)
  if (!DEBUG) {
    try {
      verifier(signature, ExtensionId, JSON.stringify(httpReq.body))
    } catch (e) {
      return httpRes.status(400).send(e.message)
    }
  }
  cekRequest.do(cekResponse)
  console.log(`CEKResponse: ${JSON.stringify(cekResponse)}`)
  return httpRes.send(cekResponse)
};

module.exports = clovaReq;
