# PM CRM Studio

PM International(피엠 인터내셔널) 파트너를 위한 **고객·상품·구매·리마인더 관리 웹앱**입니다.
기존에 업로드해주신 Flask + SQLite 버전 앱의 화면 구성과 업무 로직(고객관리, 상품관리, 구매등록, 오토십/복용주기 리마인더)을
**정적 웹사이트 + Table API(클라우드 DB)** 구조로 새로 구현하고, 스타일을 전면 리뉴얼했습니다.

> ⚠️ 안내: 업로드하신 `app.py`는 Flask 서버 + SQLite 파일 DB를 사용하는 백엔드 애플리케이션이라
> 이 도구(정적 웹사이트 빌더)에서는 그대로 실행할 수 없습니다. 대신 동일한 기능을 **Table API 기반 정적 사이트**로
> 재구현했으며, 원본에는 없던 **상품 수정 기능, 검색/차트/토스트 알림 등 UX 개선**을 추가했습니다.

---

## 1. 완성된 기능

### 대시보드 (`index.html`)
- 고객 수 / 상품 수 / 구매 수 / 대기 알림 수 요약 카드
- 최근 6개월 매출 추이 바 차트, 고객 상태 도넛 차트 (Chart.js)
- 예정 알림 Top 10, 최근 등록 고객 Top 8
- "리마인더 생성" 버튼으로 오토십/복용주기/후속관리 알림 즉시 생성

### 고객관리
- `customers.html` : 검색(PM번호/이름/전화번호), 목록, 상태 배지
- `customer-form.html` : 고객 신규 등록 / 수정 (동일 폼 재사용)
- `customer-detail.html` : 고객 상세, 구매 이력, 상담 메모 CRUD, 오토십 등록, **복용/재구매 알림 플랜(유형 분리)** 등록, PM 고유번호 복사, 공식 PM 로그인 링크

#### ⭐ 복용 알림 vs 재구매 알림 분리 (신규)
고객 상세 페이지의 "복용/재구매 알림 플랜" 섹션에서 탭으로 알림 유형을 선택할 수 있습니다.

| 구분 | 복용 알림 (intake) | 재구매 알림 (repurchase) |
|---|---|---|
| 목적 | 매일 정해진 시간에 제품을 복용하도록 리마인드 | 구매 주기가 끝나기 전에 재구매를 유도 |
| 알림 기준 | **분 단위** — 매일 복용 시각(예: 08:00) 기준 5/10/15/30분 전 | **일 단위** — 재구매 주기 종료 3/5/7일 전 |
| 동작 방식 | 브라우저 탭이 열려있는 동안 30초 간격으로 실시간 감지 → 팝업 + 토스트 + (권한 허용 시) 브라우저 알림 표시 | 대시보드/리마인더 페이지의 "리마인더 생성" 버튼으로 알림 큐(`notification_queue`)에 등록, 수동 발송 처리 |
| 저장 필드 | `daily_intake_time`, `reminder_minutes_before`, `last_notified_date`(중복 발송 방지) | `start_date`, `cycle_days`, `reminder_days_before`, `next_reminder_date` |

> ⚠️ 정적 웹사이트 특성상 **복용 알림은 서버 푸시가 아닌, 해당 브라우저 탭이 열려 있는 동안에만 동작**합니다. 탭을 닫으면 알림이 울리지 않으니, 실제 매장/사무실 PC에 상시 열어두는 용도로 활용하시는 것을 권장합니다. 실제 SMS/카카오 발송이 필요한 경우 재구매 알림처럼 알림 큐에 쌓은 뒤 별도 발송 서비스 연동이 필요합니다.

### 상품관리 (`products.html`) — ⭐ 요청 반영
- 카드형 상품 그리드 UI로 전면 개편
- **모든 상품 카드에 "수정" 버튼 추가** → 모달에서 카테고리/유형/상품명/이미지/가격/주기/오토십가능여부/메모 수정 후 저장
- 상품 추가도 동일한 모달 재사용 (신규 등록)
- 모달 내 "삭제" 버튼으로 상품 삭제 가능
- **PM International 공식 홈페이지(fitline.com)에서 확인 가능한 실제 제품 사진**을 다음 상품에 적용:
  - FitLine 파워칵테일, 리스토레이트, 액티바이즈, 프로쉐이프 에이플러스, 뮤노겐(Basics), 제너레이션 50+
  - (오토십/패키지 등 공식 단품 사진이 명확하지 않은 항목은 아이콘 placeholder로 표시)

### 구매관리
- `purchase-new.html` : 고객 선택, 구매일/채널/메모, 동적 구매 항목 행 추가/삭제, 상품 선택 시 가격유형(소비자가/회원가/오토십가) 자동 반영, 실시간 총액 계산, 복용시작일+주기 입력 시 복용 플랜 자동 생성
- `purchases.html` : 전체 구매 이력 목록

### 리마인더 (`reminders.html`)
- 오토십 결제 3일 전, 복용주기 도래, 고객 후속관리일 도래 시 알림 자동 생성(중복 방지 로직 포함)
- 발송완료 처리 버튼

### 제품 FAQ 검색 (`faq.html`) — ⭐ 신규 기능
- 참고 자료 ①: PM International 내부 Notion FAQ 데이터베이스 → 26건 (faq-01~26)
- 참고 자료 ②: "위너비그룹 전체 사업자방" 카카오톡 단체채팅(약 8개월치, 2025-09-30~2026-06-09) 대화 로그 분석 → 자주 반복된 질문 12건 신규 추가 (faq-27~38)
- 핵심 키워드를 입력하면 입력 즉시(실시간) 일치하는 질문과 답변이 화면에 나타나도록 구현
- 검색창에 키워드를 입력하면 질문 텍스트/키워드 태그/카테고리/답변 본문 순으로 가중치를 매겨 정렬 후 노출, 일치하는 단어는 하이라이트 처리
- 자주 찾는 키워드 칩(간, 임산부, 재구매, 프로쉐이프, 스테비아, 갑상선, 부작용, 포장) 원클릭 검색 지원
- 카테고리별 필터 바 제공, 아코디언 형태로 질문 클릭 시 답변 펼침/접기, 모두 펼치기 지원
- 대시보드 상단에 FAQ 검색 바로가기 배너 배치, 사이드바 메뉴에 제품 FAQ 항목 추가
- 하단에 원본 Notion FAQ 페이지로 이동하는 링크 제공

> Notion 데이터베이스는 인증 없는 REST API를 공식 제공하지 않아, 페이지를 텍스트로 추출하는 방식으로 1회성 수집하여 faq 테이블에 저장했습니다. 이후 Notion 원본 내용이 바뀌면 자동 동기화되지 않으므로, 최신 내용을 반영하려면 faq 테이블 데이터를 수동으로 갱신해야 합니다.

#### ⭐ 카카오톡 단체채팅 기반 FAQ 추가 (faq-27~38)
사업자단톡방에서 여러 사장님들이 반복적으로 질문하고 답변했던 내용 중, 기존 26건과 중복되지 않는 새로운 주제 12건을 정리해 추가했습니다.

| 분류 | 추가된 질문 주제 |
|---|---|
| 제품 보관/유통기한 | 오래된(2년 전 구매) 미개봉 제품 섭취 가능 여부, 소비기한=유통기한의 70% 규칙 |
| 섭취 방법 | 파칵/액티바이즈 카페인 원료(녹차추출물 vs 과라나추출물) 차이, 대장내시경 등 검사 당일 섭취 여부, 액티바이즈 초기 플러시 반응(홍조·화끈거림) 설명 |
| 특수 건강상태 | 소아 당뇨 아동의 3종+젤슈츠+C밸런스 섭취 사례(당화혈색소 개선), 임산부의 철분제·엽산 처방약과 병행 섭취, 뇌경색/뇌혈관질환 회복 중 병행 섭취 사례 |
| 오토십/구독 | 결제대행사 변경에 따른 카드 재등록 미이행 시 오토십 해지, 중국·일본 등 해외의 3/6개월 일시불 오토십 방식 차이 |
| 회원가입 | 우대회원(일반)으로 잘못 가입 후 팀파트너로 전환하는 방법, "한국에서 가입 안됨" 오류 시 이메일 중복 문제 해결 |
| 판매/영업 | 소비자에게 나눠줄 체험 샘플 포장 방법(지퍼백+섭취법 안내지) |

> 이 12건은 실제 대화 로그(`reference/pm-chat.txt`)를 기반으로 반복 질문 위주로 재구성한 것으로, 원문 표현을 매끄럽게 다듬어 답변으로 정리했습니다. 개인 건강 사례(당뇨·뇌경색 등)는 참고용 경험담이며 의학적 진단·처방을 대체하지 않는다는 점을 답변에도 명시했습니다.

### 기타
- `export-customers.html` : 고객 목록 CSV 다운로드 (UTF-8 BOM 포함, 엑셀 호환)
- 반응형 사이드바 네비게이션, 토스트 알림, 모달 공통 컴포넌트

---

## 2. 페이지 경로 요약

| 경로 | 설명 | 주요 파라미터 |
|---|---|---|
| `index.html` | 대시보드 | - |
| `customers.html` | 고객 목록/검색 | - |
| `customer-form.html` | 고객 등록/수정 | `?id={customerId}` (수정 시) |
| `customer-detail.html` | 고객 상세 | `?id={customerId}` (필수) |
| `products.html` | 상품 목록/등록/**수정**/삭제 | - |
| `purchases.html` | 구매 이력 목록 | - |
| `purchase-new.html` | 구매 등록 | - |
| `reminders.html` | 리마인더 큐 | - |
| `faq.html` | 제품 FAQ 키워드 검색 | - |
| `export-customers.html` | 고객 CSV 내보내기 | - |

---

## 3. 데이터 모델 (Table API)

| 테이블 | 주요 필드 |
|---|---|
| `customers` | pm_member_no, customer_name, phone_number, joined_pm_at, customer_type, status, preferred_channel, memo, last_purchase_at, next_followup_at |
| `products` | category, item_type, item_name, consumer_price, member_price, autoship_price, cycle_days, is_autoship_eligible, source_note, **image_url** |
| `purchases` | customer_id, customer_name, pm_member_no, purchase_date, channel, status, total_amount, memo |
| `purchase_items` | purchase_id, product_id, product_name, quantity, unit_price, price_type, total_price, intake_start_date, cycle_days, next_expected_date |
| `subscriptions` | customer_id, customer_name, product_id, product_name, billing_day, start_date, next_billing_date, status, discount_rate, memo |
| `intake_plans` | customer_id, customer_name, product_id, product_name, purchase_item_id, **plan_type**(intake/repurchase), start_date, cycle_days, reminder_days_before, next_reminder_date, **daily_intake_time, reminder_minutes_before, last_notified_date**, status, memo |
| `notification_queue` | customer_id, customer_name, pm_member_no, source_type, source_id, **kind**(autoship/daily_intake/repurchase/followup), channel, recipient_phone, title, body, scheduled_at, send_status |
| `notes` | customer_id, note_body, next_action_date |
| `faq` | category, question, answer, keywords(검색용 추가 키워드, 쉼표 구분), sort_order — 현재 38건 (Notion 26건 + 카카오톡 단톡방 분석 12건) |

모든 데이터는 RESTful Table API(`tables/{table}`)를 통해 CRUD 됩니다 (별도 서버 불필요).

---

## 4. 기술 스택

- HTML5 / CSS3 (커스텀 디자인 시스템, `css/style.css`)
- JavaScript (Vanilla, `js/api.js`, `js/layout.js`, `js/ui.js`, `js/reminders-engine.js`, `faq.html` 내 인라인 검색 스크립트)
- Font Awesome 6 (아이콘), Google Fonts Inter (타이포그래피)
- Chart.js (대시보드 매출/상태 차트)
- Table API (Genspark 제공 REST 데이터 저장소)

---

## 5. 아직 구현되지 않은 부분 / 원본 대비 제약

- **복용 알림의 실시간성**: 브라우저 탭이 열려있는 동안에만 감지/알림이 동작합니다(정적 사이트라 서버 푸시·백그라운드 스케줄러를 둘 수 없음). 탭을 닫거나 컴퓨터를 끄면 알림이 발생하지 않습니다.
- **실제 SMS/카카오 알림 발송**: 정적 사이트 특성상 실제 문자/카카오톡 발송은 불가능합니다. 현재는 "알림 큐 생성 + 발송완료 처리(수기 체크)" 방식입니다. 실 발송이 필요하면 별도의 인증 없는 발송 API(예: 알리고, 솔라피 등 CORS 지원 서비스)를 연동해야 합니다.
- **로그인/권한 관리**: 별도 사용자 인증 없이 누구나 접근 가능한 내부 관리 도구 형태입니다. 다중 사용자 권한 분리가 필요하면 추가 논의가 필요합니다.
- **PM International 실제 판매/주문 연동**: 사이드바의 "PM 로그인 열기"는 공식 파트너 포털로 이동하는 링크일 뿐이며, 실제 주문/정산 데이터를 자동으로 가져오지는 않습니다(공식 API 미공개).
- **상품 이미지**: 6개 핵심 상품은 공식 사이트 이미지를 적용했으나, 비즈니스팩/오토십 플랜 등 이미지가 명확치 않은 상품은 플레이스홀더로 남아있습니다. 상품 수정 모달에서 `image_url`을 직접 입력해 교체할 수 있습니다.
- **FAQ 자동 동기화 불가**: Notion 데이터베이스 원문을 실시간으로 가져오는 것이 아니라, 1회성으로 추출한 스냅샷(26건)을 `faq` 테이블에 저장한 것입니다. Notion에서 질문/답변을 추가·수정해도 이 사이트에는 자동 반영되지 않으며, 답변 본문이 하위 상세 페이지에만 있어 이번에 추출되지 않은 일부 항목(임산부 필수 영양소, 처음 드실 때 Q&A, 포장 안내 등)은 요약 안내 문구만 담겨 있어 원본 Notion 링크를 통해 상세 내용을 확인해야 합니다.

## 6. 추천 다음 단계

1. 실제 보유 고객/상품 데이터를 CSV 등으로 정리해 초기 데이터 일괄 등록
2. 필요 시 알림 발송 자동화를 위한 CORS 지원 SMS/카카오 API 연동 검토
3. 상품 이미지 URL을 PM 공식몰 최신 이미지로 주기적 업데이트
4. 매출/리텐션 등 추가 통계 위젯 확장
5. Notion FAQ가 자주 갱신된다면, `faq` 테이블에 신규/변경 항목을 주기적으로 반영(수동 복사 또는 담당자에게 최신 Q&A 텍스트 요청)
6. 답변이 하위 상세 페이지에만 있던 10개 항목(임산부 필수 영양소, 비타민 메가복용, 피엠주스 처음 드실 때 Q&A, 제품 친환경 포장지 안내, 오픈마켓 구매 대처, 지원금 관련, 호전반응 대처, 가루뭉침 대처, 파칵 찬물 안녹음, 당뇨수치 부작용 오해)의 실제 답변 본문을 담당자에게 받아 `faq` 테이블에 채워 넣기
7. 카카오톡 단체채팅 로그(`reference/pm-chat.txt`)에는 아직 정리하지 못한 구간(코드/쿠폰 배포, 승급/보상플랜 안내 등 내부 운영성 대화 위주)이 남아 있으므로, 필요 시 추가로 훑어보며 고객 응대에 실제로 쓸 만한 질문이 더 있는지 확인 후 `faq` 테이블에 보강
8. `reference/pm-chat.pdf`(용량 문제로 분석에 실패했던 원본 PDF, 17.6MB)는 더 이상 필요 없으므로 정리(삭제) 검토

---

## 7. 배포

정적 사이트이므로 별도 서버 설정 없이 바로 배포 가능합니다.
화면 상단의 **Publish 탭**에서 배포를 진행해주세요. 배포 후 제공되는 URL로 접속하면 바로 사용할 수 있습니다.
