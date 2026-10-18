/**
 * SoiPanic Landing Page & Demo Controller
 * Multi-language support (VI, JA, KO, EN), Live Interactive Analyzer Demo & UI Interactivity
 */

(function () {
  'use strict';

  // --- Real-world Sample Logs for Demo ---
  const DEMO_SAMPLES = {
    sample1: {
      name: "iPhone 11 - I2C3 SDB Error",
      device: "iPhone 11 (iPhone12,1)",
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
          suspect: "Cáp sạc / NTC nhiệt độ & Bus I2C3",
          confidence: "94% (Rất cao)",
          device: "iPhone 11 (A2111 / A2221)",
          reason: "Bus I2C3 bị treo do timeout thiết bị ngoại vi SDB không phản hồi sau chu kỳ bật nguồn.",
          evidence: "i2c3::_checkWlanStatus SDB wlan pwr on fail, timeout waiting for bus ready",
          safeSteps: "1. Thử cách ly cụm cáp sạc và micro đáy.\\n2. Đo tổng trở đường I2C3_SDA và I2C3_SCL tại socket J6400.\\n3. Kiểm tra trở kháng nhiệt NTC trên cáp trước khi can thiệp IC sạc/mainboard."
        },
        ja: {
          suspect: "ドックコネクタ / NTCサーミスタ & I2C3バス",
          confidence: "94% (非常に高い)",
          device: "iPhone 11 (iPhone12,1)",
          reason: "SDBペリフェラルが応答しないためI2C3バスがタイムアウトし、カーネルパニックが発生しました。",
          evidence: "i2c3::_checkWlanStatus SDB wlan pwr on fail, timeout waiting for bus ready",
          safeSteps: "1. ドックフレックスケーブル（充電コネクタ）を外して再起動確認。\\n2. ソケットJ6400のI2C3_SDAおよびI2C3_SCLラインのダイオード値を測定。\\n3. 基板作業の前に外付けパーツの不良を切り分けてください。"
        },
        ko: {
          suspect: "충전 독 플렉스 / NTC 온도 센서 및 I2C3 버스",
          confidence: "94% (매우 높음)",
          device: "iPhone 11 (iPhone12,1)",
          reason: "SDB 외장 장치 응답 지연으로 인해 I2C3 버스 통신 타임아웃 발생.",
          evidence: "i2c3::_checkWlanStatus SDB wlan pwr on fail, timeout waiting for bus ready",
          safeSteps: "1. 하단 충전 독 케이블 분리 후 재부팅 테스트.\\n2. 소켓 J6400의 I2C3_SDA / SCL 라인 저항값(다이오드 모드) 실측.\\n3. 메인보드 작업 전 케이블 부품 교체 우선 권장."
        },
        en: {
          suspect: "Charging Dock Flex / NTC Thermistor & I2C3 Bus",
          confidence: "94% (Very High)",
          device: "iPhone 11 (iPhone12,1)",
          reason: "I2C3 bus hang detected due to SDB peripheral timeout during power initialization.",
          evidence: "i2c3::_checkWlanStatus SDB wlan pwr on fail, timeout waiting for bus ready",
          safeSteps: "1. Disconnect dock flex cable and test reboot.\\n2. Measure diode mode impedance on I2C3_SDA and I2C3_SCL lines at J6400.\\n3. Isolate peripheral flex cable before rework on board."
        }
      }
    },
    sample2: {
      name: "iPhone 13 - Thermal PRS0 Error",
      device: "iPhone 13 (iPhone14,5)",
      text: `{"bug_type":"210","timestamp":"2026-10-18 11:20:45.00 +0700","os_version":"iPhone OS 17.4 (21E219)"}
{
  "build" : "iPhone OS 17.4 (21E219)",
  "product" : "iPhone14,5",
  "panicString" : "panic(cpu 0 caller 0xfffffff01c900e10): \\"Thermal monitor: sensor prs0 failed to report temperature within expected interval\\"",
  "panicFlags" : "0x802"
}`,
      result: {
        vi: {
          suspect: "Cảm biến áp suất PRS0 / Cụm loa trong & Mic đỉnh",
          confidence: "96% (Rất cao)",
          device: "iPhone 13 (A2482 / A2633)",
          reason: "Cảm biến nhiệt/áp kế PRS0 không phản hồi thông số định kỳ về bộ quản lý nhiệt hệ thống.",
          evidence: "Thermal monitor: sensor prs0 failed to report temperature within expected interval",
          safeSteps: "1. Cách ly dây loa trong (cụm cảm biến Face ID / Tiệm cận / Loa thoại).\\n2. Kiểm tra đường áp 1V8 cấp cho cảm biến áp kế.\\n3. Thay thế cụm cáp loa trong để kiểm tra hiện tượng sập nguồn 3 phút."
        },
        ja: {
          suspect: "気圧センサーPRS0 / イヤースピーカー・近接フレックス",
          confidence: "96% (非常に高い)",
          device: "iPhone 13 (iPhone14,5)",
          reason: "サーマルモニター監視下でPRS0気圧センサーからの温度定期レポートが途絶。",
          evidence: "Thermal monitor: sensor prs0 failed to report temperature within expected interval",
          safeSteps: "1. イヤースピーカー/近接センサーアセンブリを外して3分再起動を確認。\\n2. 気圧センサーへの1.8V電源供給ラインの短絡をチェック。\\n3. 画面側上部フレックスケーブルの交換テスト。"
        },
        ko: {
          suspect: "기압 센서 PRS0 / 수화 스피커 & 근접 센서 플렉스",
          confidence: "96% (매우 높음)",
          device: "iPhone 13 (iPhone14,5)",
          reason: "시스템 서멀 모니터에서 PRS0 기압 센서 응답 누락으로 3분 리셋 트리거.",
          evidence: "Thermal monitor: sensor prs0 failed to report temperature within expected interval",
          safeSteps: "1. 액정 상단 수화부 플렉스 케이블 분리 후 3분 꺼짐 여부 테스트.\\n2. 기압 센서 전원 라인(1.8V) 쇼트 점검.\\n3. 수화부 센서 케이블 교체 후 정상 동작 확인."
        },
        en: {
          suspect: "Barometer Sensor PRS0 / Earpiece Speaker & Proximity Flex",
          confidence: "96% (Very High)",
          device: "iPhone 13 (iPhone14,5)",
          reason: "Thermal monitor timed out waiting for periodic report from prs0 pressure/temperature sensor.",
          evidence: "Thermal monitor: sensor prs0 failed to report temperature within expected interval",
          safeSteps: "1. Disconnect front earpiece/proximity assembly and verify 3-minute reboot.\\n2. Measure 1.8V power rail feeding barometer sensor.\\n3. Replace upper flex cable assembly."
        }
      }
    },
    sample3: {
      name: "iPhone 14 Pro - SPI Sensor Timeout",
      device: "iPhone 14 Pro (iPhone15,2)",
      text: `{"bug_type":"210","timestamp":"2026-10-18 14:02:11.00 +0700","os_version":"iPhone OS 17.6"}
{
  "build" : "iPhone OS 17.6 (21G79)",
  "product" : "iPhone15,2",
  "panicString" : "panic(cpu 2 caller 0xfffffff020a112bc): \\"spi0::sensor_comm_timeout compass/accel device id mismatch\\"",
  "panicFlags" : "0x802"
}`,
      result: {
        vi: {
          suspect: "Cảm biến la bàn / Gia tốc kế SPI0 & IC Nguồn phụ",
          confidence: "89% (Cao)",
          device: "iPhone 14 Pro (A2650 / A2890)",
          reason: "Giao tiếp SPI0 với cảm biến chuyển động bị gián đoạn, sai Device ID do thiếu áp hoặc hở chân.",
          evidence: "spi0::sensor_comm_timeout compass/accel device id mismatch",
          safeSteps: "1. Kiểm tra máy có tiền sử rơi va đập khiến hở chân IC la bàn/gia tốc.\\n2. Đo trở kháng các đường SPI0_MOSI, MISO, CLK, CS.\\n3. Khò làm lại chân hoặc thay thế IC cảm biến chuyển động."
        },
        ja: {
          suspect: "SPI0 コンパス/加速度センサー & 周辺電源回路",
          confidence: "89% (高い)",
          device: "iPhone 14 Pro (iPhone15,2)",
          reason: "SPI0バス上のモーションセンサー通信障害。デバイスIDの不一致または給電遮断。",
          evidence: "spi0::sensor_comm_timeout compass/accel device id mismatch",
          safeSteps: "1. 落下衝撃によるセンサーICのハンダクラックの可能性を調査。\\n2. SPI0_MOSI / MISO / CLK / CS ラインの導通・抵抗値を測定。\\n3. コンパス/ジャイロICのリボールまたは交換を実施。"
        },
        ko: {
          suspect: "SPI0 나침반 / 가속도 센서 및 보조 전원 회로",
          confidence: "89% (높음)",
          device: "iPhone 14 Pro (iPhone15,2)",
          reason: "모션 센서와의 SPI0 통신 타임아웃 및 Device ID 불일치 오류.",
          evidence: "spi0::sensor_comm_timeout compass/accel device id mismatch",
          safeSteps: "1. 충격으로 인한 나침반/자이로 센서 냉납 여부 육안 및 현미경 점검.\\n2. SPI0_MOSI, MISO, CLK 라인 다이오드값 측정.\\n3. 모션 센서 IC 리볼링 또는 교체 진행."
        },
        en: {
          suspect: "SPI0 Compass / Accelerometer Sensor & Power Rails",
          confidence: "89% (High)",
          device: "iPhone 14 Pro (iPhone15,2)",
          reason: "SPI0 communication timeout with motion sensor and device ID mismatch.",
          evidence: "spi0::sensor_comm_timeout compass/accel device id mismatch",
          safeSteps: "1. Inspect for drop damage causing cold solder joints under compass/gyro IC.\\n2. Measure diode impedance on SPI0_MOSI, MISO, CLK lines.\\n3. Reball or replace motion sensor IC."
        }
      }
    }
  };

  // --- Multi-language Translations Dictionary for Page Elements ---
  const TRANSLATIONS = {
    vi: {
      nav_features: "Tính năng",
      nav_demo: "Demo trực tiếp",
      nav_how: "Cách sử dụng",
      nav_db: "Kho phần cứng",
      nav_faq: "Hỏi đáp",
      nav_privacy: "Quyền riêng tư",
      nav_download: "Tải ứng dụng",
      hero_badge: "Phiên bản 1.0.0 cho iOS 17 & 18 • Hỗ trợ iPhone 11 - 16 Pro Max",
      hero_title: "Chẩn Đoán Lỗi Phần Cứng iPhone Từ <span class=\"gradient-text\">Log Panic Full</span> Trong 3 Giây",
      hero_sub: "Công cụ đắc lực dành cho kỹ thuật viên sửa chữa điện thoại. Tự động khoanh vùng IC lỗi, cảm biến chập áp và hiển thị quy trình đo đạc an toàn không cần đục main.",
      hero_btn_appstore: "Tải trên App Store",
      hero_btn_demo: "Thử Nghiệm Demo",
      hero_badge_offline: "Chạy ngoại tuyến 100%",
      hero_badge_ocr: "Quét Camera OCR",
      hero_badge_privacy: "Bảo mật chuẩn Apple",
      demo_head_title: "Trải Nghiệm <span class=\"gradient-text\">Phân Tích Trực Tiếp</span>",
      demo_head_sub: "Chọn một mẫu log lỗi thực tế hoặc dán log panic-full của bạn vào khung bên dưới để chạy thử bộ phân tích:",
      demo_btn_analyze: "Phân Tích Log Ngay",
      demo_btn_clear: "Xóa Trắng",
      demo_sample_1: "Mẫu 1: iPhone 11 (I2C3)",
      demo_sample_2: "Mẫu 2: iPhone 13 (PRS0)",
      demo_sample_3: "Mẫu 3: iPhone 14 Pro (SPI)",
      demo_analyzing: "Đang phân tích cú pháp...",
      res_suspect_title: "Linh kiện nghi vấn hàng đầu",
      res_evidence_title: "Dòng bằng chứng trong log",
      res_safe_title: "Khuyến nghị kiểm tra an toàn từng bước",
      feat_title: "Tính Năng Vượt Trội Dành Cho Thợ Sửa Chữa",
      feat_sub: "Thiết kế chuyên sâu, giúp tiết kiệm hàng giờ đo mò mạch và giảm thiểu rủi ro đục nhầm IC.",
      feat_1_title: "Bộ Máy Nhận Diện Luật Ngoại Tuyến",
      feat_1_desc: "Tốc độ xử lý siêu tốc, không cần kết nối Internet. Dữ liệu lỗi được đối chiếu với cơ sở tri thức hàng ngàn ca bệnh thực tế.",
      feat_2_title: "Camera OCR Quét Log Siêu Tốc",
      feat_2_desc: "Chụp ảnh trực tiếp màn hình thiết bị hoặc ảnh chụp màn hình log từ khách hàng để trích xuất ký tự tức thì.",
      feat_3_title: "Kho Bản Đồ Cảm Biến & Sơ Đồ Khối",
      feat_3_desc: "Tra cứu vị trí chân socket, đường bus I2C/SPI, cảm biến áp kế, mic, cáp sạc, cụm loa trong trên từng dòng máy.",
      feat_4_title: "Quản Lý Ca Sửa Chữa & Xuất Báo Cáo",
      feat_4_desc: "Lưu trữ lịch sử chẩn đoán, ghi chú quá trình sửa chữa và xuất báo cáo PDF/ảnh chuyên nghiệp để gửi cho khách.",
      feat_5_title: "Trợ Lý Kỹ Thuật AI Độc Lập",
      feat_5_desc: "Cung cấp phân tích sâu về nguyên lý điện tích, đồng thời soạn sẵn lời giải thích dễ hiểu, lịch sự để thợ tư vấn khách.",
      feat_6_title: "Bảo Vệ Quyền Riêng Tư Tối Đa",
      feat_6_desc: "Tự động xóa sạch số Serial, IMEI, UDID cá nhân khỏi log trước khi xử lý, tuân thủ nghiêm ngặt tiêu chuẩn Apple.",
      cta_title: "Nâng Tầm Tốc Độ Sửa Chữa Của Bạn Ngay Hôm Nay",
      cta_sub: "Tải SoiPanic trên App Store và tạm biệt những giờ phút đọc log thủ công đau đầu.",
      footer_copy: "© 2026 SoiPanic. Bản quyền thuộc về đội ngũ phát triển SoiPanic. Bảo lưu mọi quyền."
    },
    ja: {
      nav_features: "機能",
      nav_demo: "ライブデモ",
      nav_how: "使い方",
      nav_db: "ハードウェアDB",
      nav_faq: "FAQ",
      nav_privacy: "プライバシー",
      nav_download: "アプリ入手",
      hero_badge: "iOS 17 & 18対応 • iPhone 11 〜 16 Pro Max完全サポート",
      hero_title: "iPhoneのパニックログを<span class=\"gradient-text\">3秒で精密解析</span>",
      hero_sub: "iPhone修理技術者・基板エンジニアのための必須ツール。パニックログ（panic-full）から障害ICや不具合センサーを即座に特定し、安全な診断手順を提示します。",
      hero_btn_appstore: "App Storeで入手",
      hero_btn_demo: "デモを試す",
      hero_badge_offline: "100%オフライン動作",
      hero_badge_ocr: "カメラOCR搭載",
      hero_badge_privacy: "個人情報保護",
      demo_head_title: "Web上で<span class=\"gradient-text\">パニックログ解析を体験</span>",
      demo_head_sub: "実機のパニックログサンプルを選択するか、お持ちのログを貼り付けて解析を実行してください：",
      demo_btn_analyze: "ログを解析する",
      demo_btn_clear: "クリア",
      demo_sample_1: "サンプル 1: iPhone 11 (I2C3)",
      demo_sample_2: "サンプル 2: iPhone 13 (PRS0)",
      demo_sample_3: "サンプル 3: iPhone 14 Pro (SPI)",
      demo_analyzing: "構文解析中...",
      res_suspect_title: "最も疑われる故障コンポーネント",
      res_evidence_title: "ログ内の判定根拠行",
      res_safe_title: "推奨される安全な切り分け手順",
      feat_title: "修理現場のために設計されたプロ向け機能",
      feat_sub: "回路テスターでの測定時間を大幅に短縮し、不要なIC取り外しリスクを回避します。",
      feat_1_title: "オフライン高速ルールエンジン",
      feat_1_desc: "インターネット接続不要。数千件に及ぶ修理実績から構築された知見データベースとミリ秒単位で照合。",
      feat_2_title: "カメラOCRスクリーン認識",
      feat_2_desc: "お客様から届いたログのスクリーンショットや端末画面をカメラで撮影するだけで、エラー文字列を自動抽出。",
      feat_3_title: "ハードウェア＆センサーデータベース",
      feat_3_desc: "iPhone/iPad各モデルのI2C/SPI通信バス、サーミスタ、マイク、気圧センサー、充電フレックスの回路配置を網羅。",
      feat_4_title: "修理カルテ管理と診断レポート",
      feat_4_desc: "診断結果を案件ごとに端末情報とともに保存。お客様への説明用レポートを簡単出力・共有可能。",
      feat_5_title: "AI技術アシスタント",
      feat_5_desc: "技術者向けの回路理論解説に加え、お客様への分かりやすい故障説明トークスクリプトを自動生成。",
      feat_6_title: "厳格なプライバシー保護",
      feat_6_desc: "ログ内のシリアル番号、IMEI、UDIDなどの個体識別情報を自動で安全にマスキング処理します。",
      cta_title: "今すぐ修理ワークフローを加速させましょう",
      cta_sub: "App StoreからSoiPanicをダウンロードして、ログ解読の負担から解放されましょう。",
      footer_copy: "© 2026 SoiPanic. All rights reserved."
    },
    ko: {
      nav_features: "주요 기능",
      nav_demo: "체험 데모",
      nav_how: "사용 방법",
      nav_db: "하드웨어 DB",
      nav_faq: "자주 묻는 질문",
      nav_privacy: "개인정보처리방침",
      nav_download: "앱 다운로드",
      hero_badge: "iOS 17 & 18 지원 • iPhone 11 ~ 16 Pro Max 완벽 지원",
      hero_title: "iPhone 패닉 로그를 <span class=\"gradient-text\">3초 만에 정밀 진단</span>",
      hero_sub: "스마트폰 수리 기사와 보드 엔지니어를 위한 필수 솔루션. 복잡한 panic-full 로그에서 고장 원인 부품을 즉시 좁히고 단계별 점검 절차를 안내합니다.",
      hero_btn_appstore: "App Store 다운로드",
      hero_btn_demo: "데모 실행하기",
      hero_badge_offline: "100% 오프라인 작동",
      hero_badge_ocr: "스마트 OCR 인식",
      hero_badge_privacy: "철저한 보안",
      demo_head_title: "온라인에서 <span class=\"gradient-text\">패닉 로그 분석 체험</span>",
      demo_head_sub: "실제 고장 샘플을 선택하거나 직접 로그를 붙여넣어 진단 결과를 확인해보세요:",
      demo_btn_analyze: "로그 즉시 분석",
      demo_btn_clear: "지우기",
      demo_sample_1: "샘플 1: iPhone 11 (I2C3)",
      demo_sample_2: "샘플 2: iPhone 13 (PRS0)",
      demo_sample_3: "샘플 3: iPhone 14 Pro (SPI)",
      demo_analyzing: "로그 구문 분석 중...",
      res_suspect_title: "가장 유력한 고장 의심 부품",
      res_evidence_title: "로그 내 판정 근거 라인",
      res_safe_title: "권장되는 단계별 안전 점검 가이드",
      feat_title: "스마트폰 수리 현장을 위한 강력한 핵심 기능",
      feat_sub: "수리 시간과 테스터 실측 단계를 획기적으로 줄여 불필요한 메인보드 칩셋 분리를 방지합니다.",
      feat_1_title: "오프라인 고속 규칙 엔진",
      feat_1_desc: "인터넷 없이도 즉각 동작. 수천 건의 실제 수리 케이스를 기반으로 축적된 고장 지식 룰셋 매칭.",
      feat_2_title: "카메라 OCR 스마트 캡처",
      feat_2_desc: "손님이 보내온 패닉 캡처 화면이나 기기 화면을 카메라로 비추기만 하면 텍스트를 즉시 자동 추출.",
      feat_3_title: "하드웨어 센서 & 통신 버스 DB",
      feat_3_desc: "기종별 I2C/SPI 버스 구성, 온도 센서(NTC), 수화부 케이블, 독 커넥터 회로 위치 정보 제공.",
      feat_4_title: "수리 케이스 관리 & 보고서 내보내기",
      feat_4_desc: "진단 결과를 기기 정보와 함께 기록하여 보관하고, 고객 안내용 진단서를 손쉽게 공유.",
      feat_5_title: "AI 기술 진단 어시스턴트",
      feat_5_desc: "엔지니어를 위한 회로적 원인 분석 코멘트와 고객 응대용 요약 설명을 맞춤형으로 제공.",
      feat_6_title: "철저한 프라이버시 보호",
      feat_6_desc: "단말기 시리얼, IMEI, UDID 등 민감한 개인 식별 정보를 단말 내에서 사전 마스킹 처리.",
      cta_title: "오늘부터 수리 효율을 극대화하세요",
      cta_sub: "App Store에서 SoiPanic을 다운로드하고 수리 진단의 새로운 경험을 시작하세요.",
      footer_copy: "© 2026 SoiPanic. All rights reserved."
    },
    en: {
      nav_features: "Features",
      nav_demo: "Live Demo",
      nav_how: "How It Works",
      nav_db: "Hardware DB",
      nav_faq: "FAQ",
      nav_privacy: "Privacy Policy",
      nav_download: "Download App",
      hero_badge: "v1.0.0 for iOS 17 & 18 • iPhone 11 to 16 Pro Max Support",
      hero_title: "Diagnose iPhone Hardware from <span class=\"gradient-text\">Panic Logs</span> in 3 Seconds",
      hero_sub: "The ultimate diagnostic companion for mobile repair technicians. Pinpoint faulty ICs, sensor bus shorts, and view safe step-by-step checks without unnecessary desoldering.",
      hero_btn_appstore: "Download on App Store",
      hero_btn_demo: "Try Live Demo",
      hero_badge_offline: "100% Offline Engine",
      hero_badge_ocr: "Camera OCR Scanner",
      hero_badge_privacy: "Apple-grade Privacy",
      demo_head_title: "Experience <span class=\"gradient-text\">Live Panic Analyzer</span>",
      demo_head_sub: "Pick a real-world panic log sample or paste your own kernel panic below to run the analyzer:",
      demo_btn_analyze: "Analyze Panic Log",
      demo_btn_clear: "Clear",
      demo_sample_1: "Sample 1: iPhone 11 (I2C3)",
      demo_sample_2: "Sample 2: iPhone 13 (PRS0)",
      demo_sample_3: "Sample 3: iPhone 14 Pro (SPI)",
      demo_analyzing: "Parsing log syntax...",
      res_suspect_title: "Primary Suspect Component",
      res_evidence_title: "Extracted Evidence Line",
      res_safe_title: "Recommended Safe Check Steps",
      feat_title: "Built For Mobile Repair Technicians",
      feat_sub: "Save hours of blind multimeter probing and avoid damaging healthy ICs.",
      feat_1_title: "Instant Offline Rule Engine",
      feat_1_desc: "Lightning-fast processing with zero internet connection needed. Evaluates thousands of real-world repair patterns.",
      feat_2_title: "Camera OCR Log Scanner",
      feat_2_desc: "Capture photos of client panic logs directly from device screens to extract error strings in milliseconds.",
      feat_3_title: "Hardware DB & Sensor Schematics",
      feat_3_desc: "Lookup I2C/SPI lines, NTC thermistors, barometers, dock connectors, and earpiece flex pins across models.",
      feat_4_title: "Repair Case Tracker & Export",
      feat_4_desc: "Organize client diagnostic logs into structured cases and export shareable diagnostic summaries.",
      feat_5_title: "AI Technical Assistant",
      feat_5_desc: "Deep engineering breakdown plus customer-friendly explanations ready for front-desk client communication.",
      feat_6_title: "Local Privacy By Design",
      feat_6_desc: "Automatically strips Serial Numbers, IMEIs, and device UDIDs before analysis right on your device.",
      cta_title: "Supercharge Your Repair Workflow Today",
      cta_sub: "Download SoiPanic on the App Store and eliminate guesswork from iOS panic logs.",
      footer_copy: "© 2026 SoiPanic. All rights reserved."
    }
  };

  let currentLang = 'vi';
  let currentSampleKey = 'sample1';

  // --- Initialize UI on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initDemo();
    initFAQ();
    initMobileNav();
  });

  // --- Language Management ---
  function initLanguage() {
    // Check saved or browser language
    const saved = localStorage.getItem('soipanic_lang');
    if (saved && TRANSLATIONS[saved]) {
      currentLang = saved;
    } else {
      const browserLang = (navigator.language || '').toLowerCase();
      if (browserLang.startsWith('ja')) currentLang = 'ja';
      else if (browserLang.startsWith('ko')) currentLang = 'ko';
      else if (browserLang.startsWith('vi')) currentLang = 'vi';
      else currentLang = 'en';
    }

    applyLanguage(currentLang);

    // Language Dropdown Controls
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');

    if (langBtn && langDropdown) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
      });

      langDropdown.querySelectorAll('button[data-lang]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-lang');
          if (lang && TRANSLATIONS[lang]) {
            currentLang = lang;
            localStorage.setItem('soipanic_lang', lang);
            applyLanguage(lang);
            langDropdown.classList.remove('show');
            // Re-render demo if active
            runDemoAnalysis();
          }
        });
      });
    }
  }

  function applyLanguage(lang) {
    const t = TRANSLATIONS[lang] || TRANSLATIONS.vi;
    
    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Update current lang label in nav
    const langLabel = document.getElementById('currentLangLabel');
    if (langLabel) {
      const flags = { vi: '🇻🇳 Tiếng Việt', ja: '🇯🇵 日本語', ko: '🇰🇷 한국어', en: '🇺🇸 English' };
      langLabel.textContent = flags[lang] || 'Language';
    }

    // Highlight active in dropdown
    document.querySelectorAll('.lang-dropdown button').forEach((btn) => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Interactive Demo Controller ---
  function initDemo() {
    const textarea = document.getElementById('demoInput');
    const analyzeBtn = document.getElementById('demoAnalyzeBtn');
    const clearBtn = document.getElementById('demoClearBtn');
    const sampleBtns = document.querySelectorAll('.demo-pill-btn');

    if (!textarea || !analyzeBtn) return;

    // Load initial sample
    loadSample(currentSampleKey);

    sampleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sampleBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-sample');
        if (DEMO_SAMPLES[key]) {
          currentSampleKey = key;
          loadSample(key);
        }
      });
    });

    analyzeBtn.addEventListener('click', () => {
      runDemoAnalysis();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        const output = document.getElementById('demoOutput');
        if (output) {
          output.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin: auto;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Dán log hoặc chọn một mẫu bên trên để bắt đầu phân tích.</p>
            </div>
          `;
        }
      });
    }
  }

  function loadSample(key) {
    const textarea = document.getElementById('demoInput');
    if (textarea && DEMO_SAMPLES[key]) {
      textarea.value = DEMO_SAMPLES[key].text;
      runDemoAnalysis();
    }
  }

  function runDemoAnalysis() {
    const textarea = document.getElementById('demoInput');
    const output = document.getElementById('demoOutput');
    if (!textarea || !output) return;

    const content = textarea.value.trim();
    if (!content) {
      output.innerHTML = `<p style="color: var(--amber); text-align: center; margin: auto;">Vui lòng nhập hoặc dán nội dung panic log!</p>`;
      return;
    }

    // Match sample or inspect keywords
    let match = DEMO_SAMPLES[currentSampleKey].result[currentLang];

    // Simple heuristic parser for custom pasted logs
    if (content.includes('i2c3') || content.includes('sdb') || content.includes('SDB')) {
      match = DEMO_SAMPLES.sample1.result[currentLang];
    } else if (content.includes('prs0') || content.includes('Thermal monitor')) {
      match = DEMO_SAMPLES.sample2.result[currentLang];
    } else if (content.includes('spi0') || content.includes('compass') || content.includes('accel')) {
      match = DEMO_SAMPLES.sample3.result[currentLang];
    }

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.vi;

    // Render result card with smooth appearance
    output.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">⚡</span>
            <strong style="color: #fff; font-size: 1.05rem;">${match.suspect}</strong>
          </div>
          <span class="badge-confidence">${match.confidence}</span>
        </div>
        
        <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
          ${match.reason}
        </div>

        <div>
          <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--cyan); margin-bottom: 6px; font-weight: 700;">
            ${t.res_evidence_title}
          </div>
          <div style="background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--cyan); border-left: 3px solid var(--cyan);">
            ${match.evidence}
          </div>
        </div>

        <div class="safe-check-box">
          <div style="font-weight: 700; color: #fff; font-size: 0.82rem; margin-bottom: 4px;">
            ${t.res_safe_title}:
          </div>
          <div style="color: #cbd5e1; font-size: 0.82rem; white-space: pre-line; line-height: 1.5;">
            ${match.safeSteps}
          </div>
        </div>
      </div>
    `;
  }

  // --- FAQ Accordions ---
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      if (btn) {
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close all others
          faqItems.forEach((other) => {
            other.classList.remove('active');
            const ans = other.querySelector('.faq-answer');
            if (ans) ans.style.maxHeight = null;
          });

          if (!isActive) {
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            if (answer) {
              answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
            }
          }
        });
      }
    });
  }

  // --- Mobile Navigation ---
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
          navLinks.style.display = 'none';
        } else {
          navLinks.style.display = 'flex';
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '72px';
          navLinks.style.left = '0';
          navLinks.style.right = '0';
          navLinks.style.background = 'rgba(7, 10, 18, 0.98)';
          navLinks.style.padding = '24px';
          navLinks.style.borderBottom = '1px solid var(--border-glass)';
        }
      });
    }
  }

})();
