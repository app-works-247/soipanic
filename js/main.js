// SoiPanic landing page: language switch, web demo, mobile nav.
(function () {
  'use strict';

  // ---------- demo samples ----------
  const SAMPLES = {
    sample1: {
      file: 'panic-full-2026-10-18-101523.ips',
      match: /i2c3|\bsdb\b/i,
      nets: ['I2C3_SDA', 'I2C3_SCL', 'J6400'],
      text: `{"bug_type":"210","timestamp":"2026-10-18 10:15:23.00 +0700","os_version":"iPhone OS 17.5.1 (21F90)"}
{
  "build" : "iPhone OS 17.5.1 (21F90)",
  "product" : "iPhone12,1",
  "socId" : "0x8030",
  "panicString" : "panic(cpu 1 caller 0xfffffff01bb05dc8): \\"i2c3::_checkWlanStatus SDB wlan pwr on fail, timeout waiting for bus ready\\"\\nDebugger message: panic\\nMemory ID: 0x6\\nOS version: 21F90",
  "panicFlags" : "0x802"
}`,
      result: {
        vi: {
          suspect: 'Cáp sạc, NTC nhiệt độ và bus I2C3',
          model: 'iPhone 11 (iPhone12,1)',
          tag: 'Đã kiểm chứng',
          reason: 'Bus I2C3 bị treo vì thiết bị SDB không phản hồi sau khi cấp nguồn.',
          steps: [
            'Tách cụm cáp sạc và mic đáy, khởi động lại để thử.',
            'Đo trở kháng đường I2C3_SDA và I2C3_SCL tại socket J6400.',
            'Kiểm tra NTC nhiệt độ trên cáp trước khi can thiệp IC sạc hay main.'
          ]
        },
        en: {
          suspect: 'Charging flex, NTC thermistor and I2C3 bus',
          model: 'iPhone 11 (iPhone12,1)',
          tag: 'Verified',
          reason: 'The I2C3 bus hung because the SDB peripheral did not respond after power-on.',
          steps: [
            'Disconnect the charging port flex and bottom mic, then reboot to test.',
            'Measure resistance on I2C3_SDA and I2C3_SCL at socket J6400.',
            'Check the NTC thermistor on the flex before working on the charging IC or board.'
          ]
        },
        ja: {
          suspect: 'ドックコネクタ、NTCサーミスタ、I2C3バス',
          model: 'iPhone 11 (iPhone12,1)',
          tag: '検証済み',
          reason: '電源投入後にSDBペリフェラルが応答せず、I2C3バスがハングしました。',
          steps: [
            'ドックフレックスと下部マイクを外して再起動し、症状を確認。',
            'ソケットJ6400でI2C3_SDAとI2C3_SCLの抵抗値を測定。',
            '充電ICや基板に手を入れる前に、フレックス上のNTCサーミスタを確認。'
          ]
        },
        ko: {
          suspect: '충전 독 플렉스, NTC 온도 센서, I2C3 버스',
          model: 'iPhone 11 (iPhone12,1)',
          tag: '검증됨',
          reason: '전원 인가 후 SDB 장치가 응답하지 않아 I2C3 버스가 멈췄습니다.',
          steps: [
            '충전 독 플렉스와 하단 마이크를 분리하고 재부팅해 확인합니다.',
            '소켓 J6400에서 I2C3_SDA, I2C3_SCL 라인 저항을 측정합니다.',
            '충전 IC나 보드 작업 전에 플렉스의 NTC 온도 센서를 점검합니다.'
          ]
        }
      }
    },

    sample2: {
      file: 'panic-full-2026-10-18-112045.ips',
      match: /prs0|thermal monitor/i,
      nets: ['I2C_BARO_SDA', 'I2C_BARO_SCL', 'PP1V8_VA'],
      text: `{"bug_type":"210","timestamp":"2026-10-18 11:20:45.00 +0700","os_version":"iPhone OS 17.4 (21E219)"}
{
  "build" : "iPhone OS 17.4 (21E219)",
  "product" : "iPhone14,5",
  "panicString" : "panic(cpu 0 caller 0xfffffff01c900e10): \\"Thermal monitor: sensor prs0 failed to report temperature within expected interval\\"",
  "panicFlags" : "0x802"
}`,
      result: {
        vi: {
          suspect: 'Cảm biến áp suất PRS0 trên cụm loa trong',
          model: 'iPhone 13 (iPhone14,5)',
          tag: 'Đã kiểm chứng',
          reason: 'PRS0 không gửi nhiệt độ về bộ giám sát nhiệt đúng hạn, nên máy tự khởi động lại sau khoảng 3 phút.',
          steps: [
            'Tháo cụm loa trong (Face ID, cảm biến tiệm cận, loa thoại) và xem máy còn sập sau 3 phút không.',
            'Đo đường áp 1V8 cấp cho cảm biến áp suất.',
            'Thay thử cụm cáp loa trong khác.'
          ]
        },
        en: {
          suspect: 'PRS0 pressure sensor on the earpiece flex',
          model: 'iPhone 13 (iPhone14,5)',
          tag: 'Verified',
          reason: 'PRS0 stopped reporting temperature to the thermal monitor in time, so the phone restarts after about three minutes.',
          steps: [
            'Disconnect the earpiece assembly (Face ID, proximity, earpiece speaker) and see whether the 3-minute restart stops.',
            'Measure the 1.8 V rail feeding the pressure sensor.',
            'Try a known-good earpiece flex.'
          ]
        },
        ja: {
          suspect: 'イヤースピーカー側フレックスの気圧センサーPRS0',
          model: 'iPhone 13 (iPhone14,5)',
          tag: '検証済み',
          reason: 'PRS0がサーマルモニターへ時間内に温度を報告せず、約3分ごとに再起動します。',
          steps: [
            'イヤースピーカー周りのアセンブリ（Face ID・近接センサー・受話スピーカー）を外し、3分再起動が止まるか確認。',
            '気圧センサーへの1.8V電源ラインを測定。',
            '正常なイヤースピーカーフレックスに交換して確認。'
          ]
        },
        ko: {
          suspect: '수화부 플렉스의 기압 센서 PRS0',
          model: 'iPhone 13 (iPhone14,5)',
          tag: '검증됨',
          reason: 'PRS0이 서멀 모니터에 제때 온도를 보고하지 않아 약 3분마다 재시동됩니다.',
          steps: [
            '수화부 어셈블리(Face ID, 근접 센서, 수화 스피커)를 분리하고 3분 재시동이 멈추는지 봅니다.',
            '기압 센서에 공급되는 1.8V 라인을 측정합니다.',
            '정상 수화부 플렉스로 교체해 확인합니다.'
          ]
        }
      }
    },

    sample3: {
      file: 'panic-full-2026-10-18-140211.ips',
      match: /spi0|compass|accel/i,
      nets: ['SPI0_MOSI', 'SPI0_MISO', 'SPI0_CLK', 'SPI0_CS'],
      text: `{"bug_type":"210","timestamp":"2026-10-18 14:02:11.00 +0700","os_version":"iPhone OS 17.6 (21G79)"}
{
  "build" : "iPhone OS 17.6 (21G79)",
  "product" : "iPhone15,2",
  "panicString" : "panic(cpu 2 caller 0xfffffff020a112bc): \\"spi0::sensor_comm_timeout compass/accel device id mismatch\\"",
  "panicFlags" : "0x802"
}`,
      result: {
        vi: {
          suspect: 'IC la bàn / gia tốc kế trên bus SPI0',
          model: 'iPhone 14 Pro (iPhone15,2)',
          tag: 'Độ tin cậy cao',
          reason: 'Giao tiếp SPI0 với cảm biến chuyển động bị ngắt và đọc sai Device ID, thường do thiếu áp hoặc hở chân.',
          steps: [
            'Hỏi khách máy có bị rơi không; va đập dễ làm hở chân IC la bàn, gia tốc.',
            'Đo trở kháng các đường SPI0_MOSI, MISO, CLK và CS.',
            'Làm lại chân hoặc thay IC cảm biến chuyển động.'
          ]
        },
        en: {
          suspect: 'Compass / accelerometer IC on the SPI0 bus',
          model: 'iPhone 14 Pro (iPhone15,2)',
          tag: 'High confidence',
          reason: 'SPI0 communication with the motion sensor timed out and returned the wrong device ID, usually a missing rail or a cracked joint.',
          steps: [
            'Ask whether the phone was dropped; impacts often crack the joints under the compass or accelerometer.',
            'Measure resistance on SPI0_MOSI, MISO, CLK and CS.',
            'Reball or replace the motion sensor IC.'
          ]
        },
        ja: {
          suspect: 'SPI0バス上のコンパス／加速度センサーIC',
          model: 'iPhone 14 Pro (iPhone15,2)',
          tag: '信頼度：高',
          reason: 'モーションセンサーとのSPI0通信がタイムアウトし、デバイスIDが一致しません。電源不足かハンダクラックが一般的な原因です。',
          steps: [
            '落下歴を確認。衝撃でコンパスや加速度センサーのハンダが割れることがあります。',
            'SPI0_MOSI、MISO、CLK、CSの抵抗値を測定。',
            'モーションセンサーICをリボールまたは交換。'
          ]
        },
        ko: {
          suspect: 'SPI0 버스의 나침반 / 가속도 센서 IC',
          model: 'iPhone 14 Pro (iPhone15,2)',
          tag: '신뢰도 높음',
          reason: '모션 센서와의 SPI0 통신이 시간 초과되고 Device ID가 맞지 않습니다. 보통 전원 누락이나 냉납이 원인입니다.',
          steps: [
            '낙하 이력을 확인합니다. 충격으로 나침반·가속도 센서 납땜이 깨지기 쉽습니다.',
            'SPI0_MOSI, MISO, CLK, CS 라인 저항을 측정합니다.',
            '모션 센서 IC를 리볼링하거나 교체합니다.'
          ]
        }
      }
    }
  };

  // ---------- page text ----------
  const T = {
    vi: {
      skip: 'Bỏ qua, tới nội dung',
      nav_demo: 'Dùng thử', nav_app: 'Trong ứng dụng', nav_log: 'Lấy log', nav_support: 'Hỗ trợ',
      hero_title: 'Dán log panic-full, xem linh kiện nào cần kiểm tra trước.',
      hero_sub: 'SoiPanic đọc nhật ký sập nguồn của iPhone, chỉ ra dòng gây lỗi, khoanh vùng cáp hoặc IC nghi vấn và gợi ý thứ tự kiểm tra, từ tháo cáp tới đo trở kháng, trước khi phải đụng vào main.',
      store_small: 'Tải về trên',
      hero_fine: 'Cho iPhone 11 đến iPhone 16 Pro Max. Phân tích chạy ngay trên máy, không cần mạng.',
      demo_tab_paste: 'Dán log của bạn',
      demo_input_label: 'Nội dung log panic-full',
      demo_placeholder: 'Dán toàn bộ nội dung tệp panic-full (.ips) vào đây',
      demo_analyze: 'Phân tích',
      demo_edit: 'Sửa log',
      demo_your_log: 'log-cua-ban.ips',
      demo_foot: 'Bản demo trên web chỉ nhận ra ba mẫu lỗi này. Ứng dụng có bộ luật cho từng dòng máy, chip A13 đến A18.',
      diag_src: 'Căn cứ: <b>dòng {n}</b> trong log',
      diag_steps: 'Kiểm tra theo thứ tự',
      diag_none: 'Bản demo trên web không nhận ra lỗi trong log này. Nó chỉ biết ba mẫu ở trên; ứng dụng có bộ luật đầy đủ.',
      diag_cta: 'Tải ứng dụng',
      diag_empty: 'Dán log vào ô bên trái rồi bấm Phân tích.',
      app_title: 'Trong ứng dụng',
      shot1_t: 'Soi log', shot1_d: 'Dán log, mở tệp .ips, chụp ảnh màn hình log hoặc gõ mã lỗi. Ứng dụng tự nhận dòng máy.',
      shot2_t: 'Kết quả', shot2_d: 'Các giả thuyết xếp theo khả năng, kèm đường tín hiệu trên sơ đồ và quy trình kiểm tra an toàn.',
      shot3_t: 'Phần cứng', shot3_d: 'Tách mã bitmask của SMC panic, ví dụ 0x208000, thành từng linh kiện theo thế hệ chip.',
      shot4_t: 'Sổ tay', shot4_d: 'Mỗi ca một trang: máy nào, nghi gì, đã thay gì, đang sửa hay đã xong.',
      notes_title: 'Nên biết trước khi cài',
      n1_t: 'Không cần mạng để phân tích', n1_d: 'Bộ luật và dữ liệu linh kiện nằm sẵn trong máy. Soi log ngay tại bàn sửa, kể cả khi không có Wi‑Fi.',
      n2_t: 'Thông tin của khách được ẩn', n2_d: 'Serial, IMEI, UDID và ECID bị xóa khỏi log trước khi hiển thị hay lưu lại.',
      n3_t: 'Giải thích bằng AI là tùy chọn', n3_d: 'Chỉ chạy khi bạn bấm hỏi và đồng ý. Khi đó dòng máy, mã lỗi và tối đa 300 ký tự log đã ẩn thông tin được gửi đi. Tắt hẳn được trong Cài đặt.',
      n4_t: 'Vẫn phải đo trước khi khò', n4_d: 'SoiPanic khoanh vùng dựa trên log. Hãy xác nhận bằng đồng hồ đo và kính hiển vi trước khi tháo IC.',
      n5_t: 'Dòng máy hỗ trợ', n5_d: 'iPhone 11 đến iPhone 16 Pro Max, chip A13 Bionic đến A18 Pro.',
      n6_t: 'Bốn ngôn ngữ', n6_d: 'Tiếng Việt, English, 日本語 và 한국어. Tên tín hiệu và mã lỗi giữ nguyên như trên sơ đồ.',
      log_title: 'Lấy tệp panic-full trên máy khách',
      log_intro: 'Mỗi lần iPhone tự khởi động lại vì lỗi phần cứng, iOS ghi lại một tệp panic-full. Đây là cách tìm nó.',
      log_s1: 'Mở <b>Cài đặt</b>, vào <b>Quyền riêng tư &amp; Bảo mật</b>.',
      log_s2: 'Cuộn xuống cuối, chọn <b>Phân tích &amp; Cải tiến</b>, rồi <b>Dữ liệu phân tích</b>.',
      log_s3: 'Gõ <code>panic-full</code> vào ô tìm kiếm.',
      log_s4: 'Chọn tệp có giờ gần nhất với lần máy sập nguồn.',
      log_s5: 'Bấm Chia sẻ để gửi tệp qua AirDrop hoặc Zalo, hoặc sao chép toàn bộ nội dung.',
      log_s6: 'Mở tệp bằng SoiPanic, hoặc dán nội dung vào màn hình Soi log.',
      close_text: 'Có trên App Store cho iPhone và iPad.',
      foot_support: 'Hỗ trợ', foot_privacy: 'Quyền riêng tư'
    },
    en: {
      skip: 'Skip to content',
      nav_demo: 'Try it', nav_app: 'In the app', nav_log: 'Get the log', nav_support: 'Support',
      hero_title: 'Paste a panic-full log. See which part to check first.',
      hero_sub: 'SoiPanic reads an iPhone crash log, points to the line that caused the panic, narrows it down to the flex cable or IC most likely at fault, and gives you an order of checks, from unplugging a cable to measuring resistance, before you touch the board.',
      store_small: 'Download on the',
      hero_fine: 'For iPhone 11 through iPhone 16 Pro Max. Analysis runs on the device, no internet needed.',
      demo_tab_paste: 'Paste your own log',
      demo_input_label: 'panic-full log contents',
      demo_placeholder: 'Paste the full contents of a panic-full (.ips) file here',
      demo_analyze: 'Analyze',
      demo_edit: 'Edit log',
      demo_your_log: 'your-log.ips',
      demo_foot: 'This web demo only recognizes these three faults. The app has rules for every model from A13 to A18.',
      diag_src: 'Based on <b>line {n}</b> of the log',
      diag_steps: 'Check in this order',
      diag_none: 'The web demo doesn’t recognize the fault in this log. It only knows the three samples above; the app has the full rule set.',
      diag_cta: 'Get the app',
      diag_empty: 'Paste a log on the left, then press Analyze.',
      app_title: 'In the app',
      shot1_t: 'Read a log', shot1_d: 'Paste a log, open an .ips file, photograph a log on screen, or type an error code. The model is detected for you.',
      shot2_t: 'Results', shot2_d: 'Hypotheses ranked by likelihood, with the schematic signal lines and a safe order of checks.',
      shot3_t: 'Hardware', shot3_d: 'Splits an SMC panic bitmask such as 0x208000 into individual parts, per chip generation.',
      shot4_t: 'Case notebook', shot4_d: 'One page per repair: which phone, what you suspected, what you replaced, in progress or done.',
      notes_title: 'Good to know before installing',
      n1_t: 'No internet needed to analyze', n1_d: 'The rules and parts data live on the device. Read logs at the bench, even without Wi‑Fi.',
      n2_t: 'Customer details are hidden', n2_d: 'Serial, IMEI, UDID and ECID are stripped from the log before it is shown or saved.',
      n3_t: 'AI explanations are optional', n3_d: 'They only run when you ask and agree. The model, error code and up to 300 characters of the redacted log are sent. You can turn it off in Settings.',
      n4_t: 'Still measure before you heat', n4_d: 'SoiPanic narrows things down from the log. Confirm with a multimeter and microscope before removing any IC.',
      n5_t: 'Supported models', n5_d: 'iPhone 11 through iPhone 16 Pro Max, A13 Bionic to A18 Pro.',
      n6_t: 'Four languages', n6_d: 'Tiếng Việt, English, 日本語 and 한국어. Signal names and error codes stay as they appear on the schematic.',
      log_title: 'Getting panic-full off a customer’s phone',
      log_intro: 'Every time an iPhone restarts because of a hardware fault, iOS writes a panic-full file. Here is where to find it.',
      log_s1: 'Open <b>Settings</b> and go to <b>Privacy &amp; Security</b>.',
      log_s2: 'Scroll to the bottom, tap <b>Analytics &amp; Improvements</b>, then <b>Analytics Data</b>.',
      log_s3: 'Type <code>panic-full</code> into the search field.',
      log_s4: 'Pick the file whose time is closest to when the phone went down.',
      log_s5: 'Use Share to send it over AirDrop or a messaging app, or copy the full text.',
      log_s6: 'Open the file with SoiPanic, or paste the text into the Read log screen.',
      close_text: 'On the App Store for iPhone and iPad.',
      foot_support: 'Support', foot_privacy: 'Privacy'
    },
    ja: {
      skip: '本文へスキップ',
      nav_demo: '試す', nav_app: 'アプリの中身', nav_log: 'ログの取り方', nav_support: 'サポート',
      hero_title: 'panic-fullログを貼るだけで、先に点検すべき部品がわかる。',
      hero_sub: 'SoiPanicはiPhoneのクラッシュログを読み、パニックの原因となった行を示し、疑わしいフレックスケーブルやICを絞り込みます。ケーブルの取り外しから抵抗値の測定まで、基板に手を入れる前の点検順も提示します。',
      store_small: 'ダウンロード',
      hero_fine: 'iPhone 11〜iPhone 16 Pro Maxに対応。解析は端末内で行い、ネット接続は不要です。',
      demo_tab_paste: '自分のログを貼る',
      demo_input_label: 'panic-fullログの内容',
      demo_placeholder: 'panic-full（.ips）ファイルの内容をすべてここに貼り付けてください',
      demo_analyze: '解析する',
      demo_edit: 'ログを編集',
      demo_your_log: 'your-log.ips',
      demo_foot: 'このWebデモが認識できるのは上の3例だけです。アプリにはA13〜A18の全機種向けルールが入っています。',
      diag_src: 'ログの<b>{n}行目</b>に基づく',
      diag_steps: '点検の順番',
      diag_none: 'このWebデモでは、このログの障害を認識できませんでした。認識できるのは上の3例だけで、アプリには完全なルールが入っています。',
      diag_cta: 'アプリを入手',
      diag_empty: '左にログを貼り付けて「解析する」を押してください。',
      app_title: 'アプリの中身',
      shot1_t: 'ログ解析', shot1_d: 'ログの貼り付け、.ipsファイルの読み込み、画面の撮影、エラーコードの入力に対応。機種は自動で判別します。',
      shot2_t: '診断結果', shot2_d: '可能性の高い順に仮説を表示。回路図上の信号ラインと安全な点検手順も示します。',
      shot3_t: 'ハードウェア', shot3_d: '0x208000のようなSMCパニックのビットマスクを、チップ世代ごとに部品単位へ分解します。',
      shot4_t: '修理手帳', shot4_d: '1件ごとに記録：機種、疑った部品、交換した部品、作業中か完了か。',
      notes_title: 'インストール前に知っておくこと',
      n1_t: '解析にネット接続は不要', n1_d: 'ルールと部品データは端末内にあります。Wi‑Fiがなくても作業台ですぐ使えます。',
      n2_t: 'お客様の情報は隠されます', n2_d: 'シリアル番号、IMEI、UDID、ECIDは表示・保存の前にログから削除されます。',
      n3_t: 'AIによる解説は任意', n3_d: '依頼して同意したときだけ動作し、機種、エラーコード、匿名化済みログ最大300文字が送信されます。設定でオフにできます。',
      n4_t: '加熱の前に必ず測定を', n4_d: 'SoiPanicはログから範囲を絞り込むツールです。ICを外す前にテスターと顕微鏡で確認してください。',
      n5_t: '対応機種', n5_d: 'iPhone 11〜iPhone 16 Pro Max（A13 Bionic〜A18 Pro）。',
      n6_t: '4つの言語', n6_d: 'Tiếng Việt、English、日本語、한국어。信号名とエラーコードは回路図の表記のままです。',
      log_title: 'お客様の端末からpanic-fullを取り出す',
      log_intro: 'iPhoneがハードウェア障害で再起動するたびに、iOSはpanic-fullファイルを記録します。場所は次のとおりです。',
      log_s1: '<b>設定</b>を開き、<b>プライバシーとセキュリティ</b>へ。',
      log_s2: '一番下までスクロールして<b>解析と改善</b>、次に<b>解析データ</b>をタップ。',
      log_s3: '検索欄に<code>panic-full</code>と入力。',
      log_s4: '端末が落ちた時刻に最も近いファイルを選択。',
      log_s5: '共有からAirDropやメッセージアプリで送るか、テキストをすべてコピー。',
      log_s6: 'SoiPanicでファイルを開くか、ログ解析画面に貼り付け。',
      close_text: 'iPhoneとiPad向けにApp Storeで配信中。',
      foot_support: 'サポート', foot_privacy: 'プライバシー'
    },
    ko: {
      skip: '본문으로 건너뛰기',
      nav_demo: '체험', nav_app: '앱 화면', nav_log: '로그 추출', nav_support: '지원',
      hero_title: 'panic-full 로그를 붙여 넣으면, 먼저 점검할 부품이 보입니다.',
      hero_sub: 'SoiPanic은 iPhone 크래시 로그를 읽어 패닉을 일으킨 줄을 짚어 주고, 의심되는 플렉스 케이블이나 IC를 좁혀 줍니다. 케이블 분리부터 저항 측정까지, 보드를 건드리기 전에 확인할 순서도 알려 줍니다.',
      store_small: '다운로드',
      hero_fine: 'iPhone 11부터 iPhone 16 Pro Max까지 지원. 분석은 기기 안에서 이루어지며 인터넷이 필요 없습니다.',
      demo_tab_paste: '내 로그 붙여 넣기',
      demo_input_label: 'panic-full 로그 내용',
      demo_placeholder: 'panic-full(.ips) 파일 내용을 전부 여기에 붙여 넣으세요',
      demo_analyze: '분석',
      demo_edit: '로그 수정',
      demo_your_log: 'your-log.ips',
      demo_foot: '웹 데모는 위의 세 가지 고장만 인식합니다. 앱에는 A13부터 A18까지 모든 기종의 규칙이 들어 있습니다.',
      diag_src: '로그 <b>{n}번째 줄</b> 기준',
      diag_steps: '점검 순서',
      diag_none: '웹 데모가 이 로그의 고장을 인식하지 못했습니다. 위의 세 가지 샘플만 알고 있으며, 앱에는 전체 규칙이 들어 있습니다.',
      diag_cta: '앱 받기',
      diag_empty: '왼쪽에 로그를 붙여 넣고 분석을 누르세요.',
      app_title: '앱 화면',
      shot1_t: '로그 분석', shot1_d: '로그 붙여 넣기, .ips 파일 열기, 화면 촬영, 오류 코드 입력을 지원합니다. 기종은 자동으로 인식합니다.',
      shot2_t: '진단 결과', shot2_d: '가능성 순으로 정렬된 가설과 회로도상의 신호 라인, 안전한 점검 순서를 보여 줍니다.',
      shot3_t: '하드웨어', shot3_d: '0x208000 같은 SMC 패닉 비트마스크를 칩 세대별로 부품 단위까지 나눠 줍니다.',
      shot4_t: '수리 수첩', shot4_d: '건별로 한 페이지: 어떤 기기인지, 무엇을 의심했고 무엇을 교체했는지, 수리 중인지 완료인지.',
      notes_title: '설치 전에 알아 둘 점',
      n1_t: '분석에 인터넷 불필요', n1_d: '규칙과 부품 데이터가 기기에 들어 있습니다. Wi‑Fi가 없어도 작업대에서 바로 쓸 수 있습니다.',
      n2_t: '고객 정보는 가려집니다', n2_d: '일련번호, IMEI, UDID, ECID는 표시하거나 저장하기 전에 로그에서 지워집니다.',
      n3_t: 'AI 설명은 선택 사항', n3_d: '요청하고 동의했을 때만 작동하며, 기종, 오류 코드, 익명 처리된 로그 최대 300자가 전송됩니다. 설정에서 끌 수 있습니다.',
      n4_t: '인두 대기 전에 반드시 측정', n4_d: 'SoiPanic은 로그로 범위를 좁혀 줄 뿐입니다. IC를 떼기 전에 테스터와 현미경으로 확인하세요.',
      n5_t: '지원 기종', n5_d: 'iPhone 11 ~ iPhone 16 Pro Max (A13 Bionic ~ A18 Pro).',
      n6_t: '4개 언어', n6_d: 'Tiếng Việt, English, 日本語, 한국어. 신호 이름과 오류 코드는 회로도 표기 그대로입니다.',
      log_title: '고객 기기에서 panic-full 파일 꺼내기',
      log_intro: 'iPhone이 하드웨어 문제로 재시동될 때마다 iOS는 panic-full 파일을 남깁니다. 찾는 방법은 다음과 같습니다.',
      log_s1: '<b>설정</b>을 열고 <b>개인정보 보호 및 보안</b>으로 이동합니다.',
      log_s2: '맨 아래로 내려 <b>분석 및 향상</b>, 이어서 <b>분석 데이터</b>를 누릅니다.',
      log_s3: '검색창에 <code>panic-full</code>을 입력합니다.',
      log_s4: '기기가 꺼진 시각과 가장 가까운 파일을 고릅니다.',
      log_s5: '공유 버튼으로 AirDrop이나 메신저로 보내거나, 내용을 전부 복사합니다.',
      log_s6: 'SoiPanic으로 파일을 열거나, 로그 분석 화면에 붙여 넣습니다.',
      close_text: 'iPhone과 iPad용으로 App Store에 있습니다.',
      foot_support: '지원', foot_privacy: '개인정보 처리방침'
    }
  };

  const APP_URL = 'https://apps.apple.com/app/id6824146332';
  let lang = 'vi';
  let current = 'sample1';
  let customText = '';
  let customAnalyzed = false;

  const $ = (id) => document.getElementById(id);

  document.addEventListener('DOMContentLoaded', () => {
    lang = pickLanguage();
    applyLanguage();
    initLanguageSelect();
    initDemo();
    initNav();
  });

  // ---------- language ----------
  function pickLanguage() {
    let saved = null;
    try { saved = localStorage.getItem('soipanic_lang'); } catch (e) { /* storage blocked */ }
    if (saved && T[saved]) return saved;
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('vi')) return 'vi';
    if (nav.startsWith('ja')) return 'ja';
    if (nav.startsWith('ko')) return 'ko';
    return 'en';
  }

  function applyLanguage() {
    const t = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = t[el.dataset.i18n];
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const v = t[el.dataset.i18nPlaceholder];
      if (v) el.placeholder = v;
    });
    document.querySelectorAll('img[data-shot]').forEach((img, i) => {
      img.src = `assets/web/app-${lang}-${img.dataset.shot}.jpg`;
      img.alt = t[`shot${i + 1}_t`] || '';
    });
    const sel = $('langSelect');
    if (sel) sel.value = lang;
  }

  function initLanguageSelect() {
    const sel = $('langSelect');
    if (!sel) return;
    sel.addEventListener('change', () => {
      if (!T[sel.value]) return;
      lang = sel.value;
      try { localStorage.setItem('soipanic_lang', lang); } catch (e) { /* ignore */ }
      applyLanguage();
      render(false);
    });
  }

  // ---------- demo ----------
  function initDemo() {
    const tabs = Array.from(document.querySelectorAll('.bench-tabs [role="tab"]'));
    if (!tabs.length) return;

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab, tabs));
      tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        next.focus();
        selectTab(next, tabs);
      });
      tab.tabIndex = tab.getAttribute('aria-selected') === 'true' ? 0 : -1;
    });

    $('analyzeBtn').addEventListener('click', () => {
      customText = $('logInput').value.trim();
      if (!customText) { $('logInput').focus(); return; }
      customAnalyzed = true;
      render(true);
    });

    $('editBtn').addEventListener('click', () => {
      customAnalyzed = false;
      render(false);
      $('logInput').focus();
    });

    render(false);
  }

  function selectTab(tab, tabs) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    current = tab.dataset.sample;
    if (current === 'custom') customAnalyzed = false;
    render(current !== 'custom');
    if (current === 'custom') $('logInput').focus();
  }

  function render(flash) {
    const t = T[lang];
    const view = $('logView');
    const edit = $('logEdit');
    const editBtn = $('editBtn');
    const diag = $('diagPane');

    if (current === 'custom' && !customAnalyzed) {
      view.hidden = true;
      edit.hidden = false;
      editBtn.hidden = true;
      $('logFile').textContent = t.demo_your_log;
      $('logInput').value = customText;
      diag.innerHTML = `<p class="diag-empty">${t.diag_empty}</p>`;
      return;
    }

    const text = current === 'custom' ? customText : SAMPLES[current].text;
    const key = current === 'custom' ? detect(text) : current;
    const lines = text.split(/\r?\n/);
    const faultIdx = key ? lines.findIndex((l) => SAMPLES[key].match.test(l)) : -1;

    $('logFile').textContent = current === 'custom' ? t.demo_your_log : SAMPLES[current].file;
    edit.hidden = true;
    editBtn.hidden = current !== 'custom';
    view.hidden = false;

    view.textContent = '';
    lines.forEach((line, i) => {
      const li = document.createElement('li');
      li.textContent = line || ' ';
      if (i === faultIdx) li.className = flash ? 'is-fault flash' : 'is-fault';
      view.appendChild(li);
    });

    if (!key) {
      diag.innerHTML = `<p class="diag-empty">${t.diag_none} <a href="${APP_URL}" target="_blank" rel="noopener">${t.diag_cta}</a></p>`;
      return;
    }

    const r = SAMPLES[key].result[lang];
    const nets = SAMPLES[key].nets.map((n) => `<span>${n}</span>`).join('');
    const steps = r.steps.map((s) => `<li>${s}</li>`).join('');
    const src = faultIdx >= 0 ? `<p class="diag-src">${t.diag_src.replace('{n}', faultIdx + 1)}</p>` : '';

    diag.innerHTML = `
      ${src}
      <div>
        <h3>${r.suspect}</h3>
        <p class="diag-model">${r.model}</p>
        <span class="diag-tag">${r.tag}</span>
      </div>
      <p class="diag-reason">${r.reason}</p>
      <div class="nets">${nets}</div>
      <div class="diag-steps">
        <h4>${t.diag_steps}</h4>
        <ol>${steps}</ol>
      </div>`;

    if (faultIdx >= 0) {
      const li = view.children[faultIdx];
      // keep the marked line in view inside the log pane only
      view.scrollTop = Math.max(0, li.offsetTop - view.clientHeight / 3);
    }
  }

  function detect(text) {
    return Object.keys(SAMPLES).find((k) => SAMPLES[k].match.test(text)) || null;
  }

  // ---------- mobile nav ----------
  function initNav() {
    const btn = $('navToggle');
    const nav = $('siteNav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
