const arrayShuffle = require('array-shuffle')
const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN, ExtensionId, DEBUG } = require('../config')
var verifier = require('../util/verifier.js')

const FUDA = 
  ['秋の田の　かりほの庵の　苫をあらみ　わが衣手は　露にぬれつつ',
  '春すぎて　夏来にけらし　白妙の　衣ほすてふ　天の香具山',
  'あしびきの　山鳥の尾の　しだり尾の　ながながし夜を　ひとりかも寝む',
  '田子の浦に　うち出でてみれば　白妙の　富士の高嶺に　雪は降りつつ',
  '奥山に　紅葉踏みわけ　鳴く鹿の　声きく時ぞ　秋は悲しき',
  'かささぎの　渡せる橋に　おく霜の　白きをみれば　夜ぞふけにける',
  '天の原　ふりさけ見れば　春日なる　三笠の山に　出でし月かも',
  'わが庵は　都のたつみ　しかぞすむ　世をうぢ山と　人はいふなり',
  '花の色は　うつりにけりな　いたづらに　わが身世にふる　ながめせしまに',
  'これやこの　行くも帰るも　別れては　知るも知らぬも　逢坂の関',
  'わたの原　八十島かけて　漕ぎ出でぬと　人には告げよ　海人の釣舟', 
  '天つ風　雲の通ひ路　吹き閉ぢよ　をとめの姿　しばしとどめむ',
  '筑波嶺の　峰より落つる　男女川　恋ぞつもりて　淵となりぬる',
  '陸奥の　しのぶもぢずり　誰ゆゑに　乱れそめにし　われならなくに',
  '君がため　春の野に出でて　若菜つむ　わが衣手に　雪は降りつつ',
  'たち別れ　いなばの山の　峰に生ふる　まつとし聞かば　今帰り来む',
  'ちはやぶる　神代も聞かず　竜田川　からくれなゐに　水くくるとは',
  '住の江の　岸による波　よるさへや　夢の通ひ路　人めよくらむ',
  '難波潟　みじかき芦の　ふしの間も　逢はでこの世を　過ぐしてよとや',
  'わびぬれば　今はた同じ　難波なる　みをつくしても　逢はむとぞ思ふ',
  '今来むと　言ひしばかりに　長月の　有明の月を　待ち出でつるかな',
  '吹くからに　秋の草木の　しをるれば　むべ山風を　嵐といふらむ',
  '月見れば　ちぢにものこそ　悲しけれ　わが身一つの　秋にはあらねど',
  'このたびは　ぬさもとりあへず　手向山　紅葉の錦　神のまにまに',
  '名にしおはば　逢坂山の　さねかづら　人にしられで　くるよしもがな',
  '小倉山　峰のもみぢ葉　心あらば　今ひとたびの　みゆき待たなむ',
  'みかの原　わきて流るる　泉川　いつ見きとてか　恋しかるらむ<',
  '山里は　冬ぞさびしさ　まさりける　人目も草も　かれぬと思へば',
  '心あてに　折らばや折らむ　初霜の　置きまどはせる　白菊の花',
  '有明の　つれなく見えし　別れより　あかつきばかり　憂きものはなし',
  '朝ぼらけ　有明の月と　見るまでに　吉野の里に　降れる白雪',
  '山川に　風のかけたる　しがらみは　流れもあへぬ　紅葉なりけり',
  'ひさかたの　光のどけき　春の日に　静心なく　花の散るらむ',
  '誰をかも　知る人にせむ　高砂の　松も昔の　友ならなくに',
  '人はいさ　心も知らず　ふるさとは　花ぞ昔の　香ににほひける',
  '夏の夜は　まだ宵ながら　明けぬるを　雲のいづこに　月宿るらむ',
  '白露に　風の吹きしく　秋の野は　つらぬきとめぬ　玉ぞ散りける',
  '忘らるる　身をば思はず　誓ひてし　人の命の　惜しくもあるかな',
  '浅茅生の　小野の篠原　しのぶれど　あまりてなどか　人の恋しき',
  'しのぶれど　色に出でにけり　わが恋は　物や思ふと　人の問ふまで',
  '恋すてふ　わが名はまだき　立ちにけり　人知れずこそ　思ひそめしか',
  '契りきな　かたみに袖を　しぼりつつ　末の松山　波越さじとは',
  '逢ひ見ての　のちの心に　くらぶれば　昔は物を　思はざりけり',
  '逢ふことの　絶えてしなくは　なかなかに　人をも身をも　恨みざらまし',
  'あはれとも　いふべき人は　思ほえで　身のいたづらに　なりぬべきかな',
  '由良のとを　渡る舟人　かぢを絶え　ゆくへも知らぬ　恋の道かな',
  '八重葎　しげれる宿の　さびしきに　人こそ見えね　秋は来にけり',
  '風をいたみ　岩うつ波の　おのれのみ　くだけて物を　思ふころかな',
  'みかきもり　衛士のたく火の　夜は燃え　昼は消えつつ　物をこそ思へ',
  '君がため　惜しからざりし　命さへ　長くもがなと　思ひけるかな',
  'かくとだに　えやはいぶきの　さしも草　さしも知らじな　燃ゆる思ひを',
  '明けぬれば　暮るるものとは　知りながら　なほうらめしき　朝ぼらけかな',
  '嘆きつつ　ひとり寝る夜の　明くる間は　いかに久しき　ものとかは知る',
  '忘れじの　行く末までは　かたければ　今日を限りの　命ともがな',
  '滝の音は　絶えて久しく　なりぬれど　名こそ流れて　なほ聞こえけれ',
  'あらざらむ　この世のほかの　思ひ出に　今ひとたびの　逢ふこともがな',
  'めぐりあひて　見しやそれとも　わかぬ間に　雲がくれにし　夜半の月かな',
  '有馬山　猪名の笹原　風吹けば　いでそよ人を　忘れやはする',
  'やすらはで　寝なましものを　さ夜更けて　かたぶくまでの　月を見しかな',
  '大江山　いく野の道の　遠ければ　まだふみもみず　天の橋立',
  'いにしへの　奈良の都の　八重桜　けふ九重に　にほひぬるかな',
  '夜をこめて　鳥のそらねは　はかるとも　よに逢坂の　関はゆるさじ',
  '今はただ　思ひ絶えなむ　とばかりを　人づてならで　言ふよしもがな',
  '朝ぼらけ　宇治の川霧　たえだえに　あらはれわたる　瀬々の網代木',
  '恨みわび　ほさぬ袖だに　あるものを　恋に朽ちなむ　名こそ惜しけれ',
  'もろともに　あはれと思へ　山桜　花よりほかに　知る人もなし',
  '春の夜の　夢ばかりなる　手枕に　かひなく立たむ　名こそ惜しけれ',
  '心にも　あらでうき世に　ながらへば　恋しかるべき　夜半の月かな',
  '嵐吹く　み室の山の　もみぢ葉は　竜田の川の　錦なりけり',
  'さびしさに　宿を立ち出でて　ながむれば　いづこも同じ　秋の夕暮れ',
  '夕されば　門田の稲葉　おとづれて　芦のまろやに　秋風ぞ吹く',
  '音に聞く　高師の浜の　あだ波は　かけじや袖の　ぬれもこそすれ',
  '高砂の　尾の上の桜　咲きにけり　外山の霞　立たずもあらなむ',
  '憂かりける　人を初瀬の　山おろしよ　はげしかれとは　祈らぬものを',
  '契りおきし　させもが露を　命にて　あはれ今年の　秋もいぬめり',
  'わたの原　漕ぎ出でて見れば　ひさかたの　雲居にまがふ　沖つ白波',
  '瀬をはやみ　岩にせかるる　滝川の　われても末に　あはむとぞ思ふ',
  '淡路島　かよふ千鳥の　鳴く声に　いく夜寝覚めぬ　須磨の関守',
  '秋風に　たなびく雲の　絶え間より　もれ出づる月の　影のさやけさ',
  '長からむ　心も知らず　黒髪の　乱れて今朝は　物をこそ思へ',
  'ほととぎす　鳴きつる方を　ながむれば　ただ有明の　月ぞ残れる',
  '思ひわび　さても命は　あるものを　憂きにたへぬは　涙なりけり',
  '世の中よ　道こそなけれ　思ひ入る　山の奥にも　鹿ぞ鳴くなる',
  '長らへば　またこのごろや　しのばれむ　憂しと見し世ぞ　今は恋しき',
  '夜もすがら　物思ふころは　明けやらで　閨のひまさへ　つれなかりけり',
  '嘆けとて　月やは物を　思はする　かこち顔なる　わが涙かな',
  '村雨の　露もまだひぬ　真木の葉に　霧立ちのぼる　秋の夕暮れ',
  '難波江の　芦のかりねの　ひとよゆゑ　みをつくしてや　恋ひわたるべき',
  '玉の緒よ　絶えなば絶えね　ながらへば　忍ぶることの　よわりもぞする',
  '見せばやな　雄島のあまの　袖だにも　ぬれにぞぬれし　色はかはらず',
  'きりぎりす　鳴くや霜夜の　さむしろに　衣かたしき　ひとりかも寝む',
  'わが袖は　潮干に見えぬ　沖の石の　人こそ知らね　かわく間もなし',
  '世の中は　常にもがもな　渚こぐ　あまの小舟の　綱手かなしも',
  'み吉野の　山の秋風　さ夜更けて　ふるさと寒く　衣うつなり',
  'おほけなく　うき世の民に　おほふかな　わが立つ杣に　墨染の袖',
  '花さそふ　嵐の庭の　雪ならで　ふりゆくものは　わが身なりけり',
  '来ぬ人を　まつほの浦の　夕なぎに　焼くや藻塩の　身もこがれつつ',
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
    cekResponse.setSimpleSpeechText('次のフダを読む場合は、次へ、同じフダを読む場合は、もう一度と言ってください。')
    cekResponse.setMultiturn({order : null, index : -1});
  }

  intentRequest(cekResponse) {
    console.log('intentRequest')
    console.dir(this.request)
    const intent = this.request.intent.name
    const slots = this.request.intent.slots
    var index = null
    var order = null

    console.log(this.session.sessionAttributes.order)
    if (this.session.sessionAttributes.order == null) {
      cekResponse.appendSpeechText(`それでは始めます`)
      order = [...Array(100).keys()];
      index = -1
//      order = arrayShuffle([...Array(100).keys()]);
    } else {
      order = this.session.sessionAttributes.order
      index = this.session.sessionAttributes.index
    }
    
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
      cekResponse.setSimpleSpeechText("次の札を読む場合は、次へ、同じ札を読む場合は、もう一度と言ってください") 
    }
    cekResponse.setMultiturn({"order" : order, index : index})
  }

  sessionEndedRequest(cekResponse) {
    console.log('sessionEndedRequest')
    cekResponse.setSimpleSpeechText('百人一首を終了します。')
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
