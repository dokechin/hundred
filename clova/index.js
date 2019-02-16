const arrayShuffle = require('array-shuffle')
const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN, ExtensionId, DEBUG } = require('../config')
var verifier = require('../util/verifier.js')
var LRU = require('lru-cache')
const options = { max: 5000, maxAge: 1000 * 60 * 60 }
var cache = new LRU(options)

const FUDA = 
  ['秋の田の。　かりほの庵の　苫woarami。　わが衣手は、　つゆにぬれつつ',
  '春杉て。　夏きにけらし　白妙の。　衣hosu蝶、　あまのカグヤマ',
  'あしびきの。 山鳥の尾の　しだり尾の。 ながながし予を、　ひとりかもねん',
  '田子の浦に。 うちでてみれば　白妙の。 富士の高嶺に、　雪はふりつつ',
  '奥山に。 もみじ踏みわけ　鳴く鹿の。 声きく時ぞ、　秋は悲しき',
  'かささぎの。 渡せる橋に　おく霜の。 白きをみれば、　よぞふけにける',
  '甘のはら。 ふりさけ見れば　かすがなる。 三笠の山に、　いでし月かも',
  'わが庵は。 みやこのたつみ　鹿ぞすむ。 世をうじヤマと、　人はいうなり',
  '花の色は。 鬱りにけりな　イタズラに。 わが身よにふる、　ながめせしまに',
  'これやこの。 行くも帰るも　別れては。 知るも知らぬも、　逢坂の関',
  '和たノハラ。 耶蘇しまかけて　漕ぎ医でぬと。　人には告げよ、　あまの釣舟', 
  '天つ風。 雲のかよいじ　吹き綴じよ。 おとめの姿、　しばし留どめん',
  '筑波嶺の。 峰より落つる　minanogawa。 恋ぞつもりて、　淵となりぬる',
  '陸奥の。 忍ぶ文字zuri　誰ゆゑに。 乱れそめにし、　われならなくに',
  '君がため。　春の野に出でて　若菜つむ。　わが衣手に、　雪はふりつつ',
  '太刀わかれ。　いなばの山の。 峰におうる。　まつ年聞かば、　今帰りこん',
  'ちはやぶる。　髪予も聞かず　taつtagawa。　殻くれないに、　水くくるとは',
  'すみの江の。 岸に夜並み　よるさへや。　夢のかよいじ、　ひとめよくらむ',
  'なにわがた。　みじかき芦の　ふしのまも。　逢わでこの世を、　すぐしてよとや',
  'わびぬれば。 今はた同じ。　なにわなる。　みをつくしても、　逢はんとぞ思ふ',
  'ima婚と。　いいしばかりに　長月の。 有明の月を、　待ち胃でつるカナ',
  '吹くからに。 秋の草木の　しをるれば。　むべ山風を、　嵐といふらん',
  '月見れば。　ちぢにものこそ　悲しけれ。　わが身一つの、　秋にはあらねど',
  'このたびは。 ぬさもとりあへず　手向け山。　もみじの錦、 神のまにまに',
  '名にしおwaば。 おうさかやまの　さねかづら。　ひとにしられで、　くるよしもがな',
  '小倉山。 峰のもみぢば　心あらば。　今ひとたびの、　みゆきまたなん',
  '実花野原。 わきて流るる　泉川。　いつ見きとてか、　恋しかるらん',
  '山里は。 冬ぞさびしさ　まさりける。　人目も草も、　かれぬと思へば',
  '心あてに。　折らbaは折らん　初しもの。 沖maどwaseru、　白菊の花',
  '有明の。 つれなく見えし　別れより。　あかつきばかり、　うき物はなし',
  '朝ぼらけ。 有明の月と　見るまでに。　吉野の差とに、　ふれる白雪',
  '山川に。 風のかけたる　しがらみは。　流れもあえぬ、　もみじなりけり',
  'ひさかたの。 光のどけき　春の日に。　Sizu心なく、　花の散るらん',
  '誰をかも。 しるヒトにせん　高砂の。　松も昔の、　友なら無くに',
  '人はいさ。　こころも知らず　ふるさとは。　花ぞ昔の、　かに匂い蹴る',
  '夏のよは。　まだよいながら　明けぬるを。　雲のいづこに、　月宿るらん',
  'しらつゆに。　風の吹きしく　秋の野は。　貫き止めぬ、玉ぞ散りける',
  '和酢ららる。　身をば思はず　ちかいてし。　人の命の、　惜しく藻arukana',
  '麻じうの。　小野のしのはら　しのぶれど。 あまりてなどか、　人の恋しき',
  'しのぶれど。 色に出でにけり　わが恋は。　物や思うと、　人のとうまで',
  '恋すちょう。 わが名はまだき。　立ちにけり。 ひと知れずこそ、　思ひそめしか',
  '契りきな。 かたみに袖を　しぼりつつ。　吸えの松山、　なみ小匙とは',
  'あひ見ての。 のちの心に　くらぶれば。　昔は物を、　お藻は、THE理ケリ',
  '会う事の。　絶えてしなくは　なかなかに。 人をも身をも、　恨みざらまし',
  'あはれとも。 いふべき人は　思おえで。 身のいたづらに、　なりぬべきkana',
  'ゆらのとを。　渡る舟人　かぢを絶え。　ゆくへも知らぬ、　恋の道カナ',
  '八重葎。 しげれる宿の　さびしきに。 人こそ見えね、　秋は木にけり',
  '風を痛み。 岩うつなみの　おのれのみ。 くだけてものを、　思う頃かな！',
  'みかきもり。 えじのたくひの　夜は燃え。 昼は消えつつ、　物をこそ思へ',
  '君がため。 惜しから!Theラシ 　命さえ。　長くもがなと、　思ひける佳奈',
  'かくとだに。 えやは伊吹の　さしもぐさ。 さしも知らじな、　燃ゆる思いを',
  '明けぬれば。 くるるものとは　知りながら。 なおうらめしき、　朝ぼらけカナ',
  '嘆きつつ。　ひとりねるよの。　明くる間は。 いかに飛砂式、。　ものとかは知る',
  '忘れじの。 行く末までは。　かたければ。 今日を限りの、　命ともガナ',
  '滝の音は。 絶えて久しく　なりぬれど。　名こそ流れて、　なお聞こえ蹴れ',
  '阿良 皿ん。　この世のほかの　思ひ出に。　今ひとたびの、　あうことも蛾na',
  'めぐりあいて。　見しやそれとも　湧かぬまに。　雲がくれにし、　余波の月かな',
  '有馬山。 いなのささはら　風吹けば。 いで祖ヨヒトを、　忘れやはする',
  'やすらわで。 寝ナマしものを　さよふけて。 かたぶくまでの、　月を身死カナ',
  '大江山。 いく野の道の。　遠ければ。　まだふみもみず、　あまの橋立',
  'いにしへの。 奈良のみやこの　八重桜。　今日ここの絵に、　においぬるカナ',
  '世を混めて！。　鳥のそらねは　はかるTomo。　世に大阪の、　sekiは揺る匙',
  '今はただ。　思ひ絶えなん、　とばかりを。　人づてならで、　言ふよしもがな！',
  '朝ぼらけ。　宇治の川ぎり　たえだえに。　あらはれわたる、　せぜの網代木',
  '恨みわび。　ほさぬ袖だに　ある者を。　恋にくちなん、　名こそ惜し蹴れ',
  'もろともに。　あはれと思へ　山桜。　花よりほかに、　汁ヒトもなし',
  '春のよの。　夢ばかりなる　たまくらに。　kaiなく立たん、　名こそ惜しけれ',
  '心にも。　あらでうきよに　ながらえば。　恋し狩るべき、　余波の月かな',
  '嵐吹く。　みむろの山の　もみぢばは。　竜田の川の、　錦なりけり',
  'さびしさに。　宿を立ち出でて　ながむれば。　いづこも同じ、　秋の夕暮れ',
  '悠されば。　門田の稲葉　おとづれて。　芦のまろやに、　秋風ぞ吹く',
  '音に聞く。　たかしの浜の　あだ波は。　掛け字や袖の、　ぬれもこそすれ',
  '高砂の。　おの上の桜　咲きにけり。　富山のかすみ、　立たずも阿良なん',
  'うかりける。　人をはつせの　山おろしよ。　はげしかれとは、　祈らぬものを',
  'ちぎりおきし。　させもがつゆを　命にて。　あはれ今年の、　秋も戌めり',
  '棉の腹。　漕ぎいでて見れば。　ひさかたの。　くもいにまがう、　沖つ白波',
  '瀬を早見。　岩にせかるる。　滝川の。　われても末に、　泡んとぞ思う',
  '淡路島。　かよう千鳥の　鳴く声に。　育代寝覚めぬ、　すまのせきもり',
  '秋風に。　たなびく雲の。　絶え間より。　もれいづる月の、　影のさやけさ',
  '長からん。　心も知らず　黒髪の。　乱れて今朝は、　物をこそ思へ',
  'ほととぎす。　なきつるかたを　ながむれば。　ただ有明の、　月ぞ残れる',
  '思ひわび。　さても命は　あるものを。　浮きにたえぬは、　涙なりけり',
  '世の中よ。　道こそなけれ　思ひ入る。　山の奥にも、　鹿ぞ鳴くなる',
  'ながらえば。　またこの頃や　しのばれん。　牛とみしよぞ、　今は恋しき',
  '夜もすがら。　物思ふころは　明けやらで。　ねやのひまさえ、　つれ無かり蹴り',
  'なげけとて。　月や和ものを　思はする。　かこち顔なる、　わが涙かな',
  'むらさめの。　つゆもまだひぬ　まきの葉に。　きり立ちのぼる、　秋の夕暮れ',
  'なにわえの。　芦のかりねの　ひと夜ゆえ。　みをつくしてや、　こひわたるべき',
  '玉の緒よ。　たえなばたえね　ながらえば。　しのぶることの、　弱りもぞする',
  'みせばやな。　おしまのあまの　袖だにも。　ぬれにぞぬれし、　色は変わらず',
  'きりぎりす。　鳴くやしもよの　さむしろに。　ころもかたしき、　ひとりかもねん',
  'わが袖は。　潮干に見えぬ。　沖の石の。　人こそ知らね、　かわく間もなし',
  '世の中は。　常にもがもな。　渚こぐ。　あまの小船の、　つなでかなしも',
  'み吉野の。　山の秋風　さよ更けて。　ふるさと寒く、　衣うつなり',
  'おおけなく。　うきよの民に　覆うカナ？。　わが立つ杣に、　墨染の祖で',
  '花さそふ。　嵐の庭の　雪ならで。　ふりゆくものは、　わが身鳴り蹴り',
  'こぬ人を。　まつほのUraの　夕なぎに。　役や藻塩の、　身もこがれつつ',
  'Kazeそよぐ。　ならの小川の　夕暮れは。　みそぎぞ夏の、　しるしなりける',
  '人もおし。　人も恨めし。　あぢきなく。　世を思うゆえに、　物思ふ身は',
  'ももしきや。　古き軒端の　しのぶにも。　なおあまりある、　昔なりけり'
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
    var cached = cache.get(this.session.user.userId)
    if (typeof cached === 'undefined') {
      cached = { order : arrayShuffle([...Array(100).keys()]), index : 0};
      cache.set(this.session.user.userId, cached)
      cekResponse.appendSpeechText({
        lang: 'ja',
        type: 'URL',
        value: `${DOMAIN}/koto_01.mp3`,
      })
      cekResponse.appendSpeechText("百人一首を始めるよ。読んだ後に、次、または、もう一度といってね")
      cekResponse.appendSpeechText({
        lang: 'ja',
        type: 'URL',
        value: `${DOMAIN}/mute_01sec.wav`,
      })
    }
    cekResponse.setMultiturn({mode : 'play'});
    cekResponse.appendSpeechText(FUDA[cached.order[cached.index]])
  }

  intentRequest(cekResponse) {
    console.log('intentRequest')
    console.dir(this.request)
    const intent = this.request.intent.name
    const slots = this.request.intent.slots
    var index = null
    var order = null

    var cached = cache.get(this.session.user.userId)
    if (typeof cached === 'undefined') {
      order = [...Array(100).keys()]
      index = 0
    } else {
      index = cached.index
      order = cached.order  
    }

    switch (intent) {
    case 'PinpointIntent':
      index = slots.index.value - 1 
      cekResponse.appendSpeechText(FUDA[index])
      break;
    case 'NextIntent':
      if (index >= 99){
        cekResponse.appendSpeechText(`もう一度プレーする場合は、リプレイといってね`)
        break
      } else {
        index++;
      }  
      cekResponse.appendSpeechText(FUDA[order[index]])
      break;
    case 'ReplayIntent': 
      cekResponse.appendSpeechText("百人一首を始めるよ。読んだ後に、次、または、もう一度といってね")
      cekResponse.appendSpeechText({
        lang: 'ja',
        type: 'URL',
        value: `${DOMAIN}/mute_01sec.wav`,
      })
      order = arrayShuffle([...Array(100).keys()]);
      index = 0;
      cekResponse.appendSpeechText(FUDA[order[index]])
      break;
    case 'RepeatIntent':
      cekResponse.appendSpeechText(FUDA[order[index]])
      break
    case 'Clova.GuideIntent': 
    default: 
      cekResponse.setSimpleSpeechText("次、または、もう一度といってね") 
    }
    cached = {order : order,index : index}
    cache.set(this.session.user.userId, cached)
    cekResponse.setMultiturn({mode : 'play'});

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
