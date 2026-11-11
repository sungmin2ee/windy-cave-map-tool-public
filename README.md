# 3-Match Puzzle Map Tool

제작: [sungmin2ee](https://github.com/sungmin2ee)

`Cave = 하나의 레벨` 규칙으로 제작한 브라우저 기반 퍼즐 맵 에디터입니다.

[▶ 맵툴 실행하기](https://sungmin2ee.github.io/windy-cave-map-tool-public/)

## JSON 편집 및 패치

- 처음 열면 오브젝트 팔레트가 비어 있습니다. 레이어를 고르고 **오브젝트 만들기**에서 이름과 선택 사항인 JSON ID를 입력해 새 종류를 등록할 수 있습니다.
- **JSON 가져오기**는 레이어가 지정된 셀의 오브젝트 ID를 읽어 팔레트에 등록합니다. 표시 이름이나 배치 전 종류는 `assetDefinitions`에 레이어별로 선언할 수 있습니다. 예를 들어 `"assetDefinitions": {"item": [{"id": "gem", "name": "보석"}]}`입니다.
- 사용자 정의 종류는 레이어의 일반 동작을 따릅니다. 레이어 정보나 매핑이 없는 외부 형식의 토큰은 가져오기 결과에서 미매핑 값으로 표시됩니다.
- **새 Cave**로 빈 맵을 추가하거나 **시드로 블록 랜덤 배치**로 블록을 생성할 수 있습니다.
- 패치의 기준이 될 상태를 **JSON 내보내기**로 저장합니다. 맵을 편집한 뒤 `CONTENT VERSION`을 직접 입력하거나 `− / +`로 바꾸고, **패치 내보내기**에서 기준 JSON을 선택합니다.
- 클라이언트는 현재 콘텐츠 버전이 패치의 `baseContentVersion`과 정확히 일치할 때 적용하고, 완료 후 `contentVersion`으로 갱신합니다. 대상 버전이 기준 버전보다 낮은 패치도 만들 수 있습니다.

## 기능

- Terrain / Block / Gimmick / Item 레이어 기반 그리드 편집
- 팔레트 항목 선택 후 클릭·드래그 추가, 레이어별 지우기, 선택 재클릭 해제
- 브러시, 채우기, 지우개, 칸 비활성화 및 복원, Undo / Redo
- Cave 생성, 복제, 삭제, 이전/다음 이동
- 맵 크기, 중력, 최대 4개의 다중 목표, Moves, 권장·테스트 클리어 Moves 설정
- Block 제거 / Terrain 파괴 / Gimmick 활성화 / Item 수집 목표와 맵 배치 수 자동 집계
- Moves 여유, 맵 크기, 색상·기믹 수 기반 휴리스틱 난이도(Easy~Expert) 분석
- 파생 시드 10/30/100회의 자동 플레이로 클리어율·평균·중앙·90% Moves 검증
- Teleport A/B, 목표 수량, 사용 색상, Moves 밸런스 오류·경고 검증
- Windy 형식과 외부 퍼즐 JSON(levels/stages/maps/puzzles, 단일 레벨, 배열) 가져오기
- DDUNG_PUZZLE `MapInfo.json`의 1,900개 이상 레벨, 타일·목표·중력·색상 데이터를 자동 변환
- 대량 레벨용 번호·이름 검색과 200개 단위 화면 렌더링으로 빠른 탐색
- Client/Schema/Content 버전 검사와 기준 버전 일치형 패치 JSON 적용
- 시드·밀도 기반 재현 가능한 랜덤 블록 배치(초기 가로·세로 3-Match 방지)
- 인접 블록 교환, 3-Match 제거, 리필·중력·연쇄, Moves와 레이어별 목표를 계산하는 Playtest
- 막힌 Terrain을 만났을 때 좌/우 우선·교대·시드 랜덤 방식의 우회 중력 흐름
- Terrain 종류별 흐름 차단 여부, 제거 불가·같은 칸·인접 4방향 매치 반응과 1~99 내구도
- 로컬 저장과 JSON 내보내기
- 플레이 기록을 테스트 클리어 Moves로 반영

외부 JSON은 `width/height`, `grid/board/cells/tiles`, `layers`, `moveLimit/maxMoves`,
`target/goal/objective` 등의 일반적인 키를 자동 인식합니다. 프로젝트 고유 형식은 샘플 JSON을
기준으로 별도 매핑을 추가할 수 있습니다.

모든 JSON 형식을 무조건 읽는 것은 아닙니다. 위의 공통 키와 숫자 타일 `0~17`은 자동
변환하며, 게임 고유 토큰은 샘플 JSON에 맞춘 매핑이 필요합니다.

## 버전의 역할

- `Client 2.6.0`: 실행 중인 맵툴 코드 버전입니다. JSON의 `minimumClientVersion`보다 낮으면 가져오기를 중단합니다.
- `Schema 5`: 다중 레이어 목표가 추가된 JSON 구조 버전입니다. 현재 지원 범위보다 새 구조면 잘못 해석하지 않고 중단합니다.
- `Content Version`: 맵 데이터 묶음 버전입니다. 패치의 `baseContentVersion`과 현재 값이 정확히 같을 때만 패치를 적용합니다.
- HTML의 `?v=15`: 브라우저 캐시 갱신용이며 위 세 버전과 관계없습니다.

패치는 전체 데이터를 다시 받지 않고 변경 Cave만 추가·교체하거나 삭제합니다.

```json
{
  "schema": "windy-cave-map-tool/v5",
  "schemaVersion": 5,
  "type": "patch",
  "baseContentVersion": "V0001",
  "contentVersion": "V0002",
  "minimumClientVersion": "2.4.0",
  "patch": {
    "upsertCaves": [{ "id": "existing-cave-id", "name": "수정 Cave", "width": 10, "height": 12, "layers": {} }],
    "removeCaveIds": ["deleted-cave-id"]
  }
}
```

## 난이도 기준

자동 점수는 맵 면적(0~2), 실제 사용 색상 수(0~2), 기믹 수(0~2), 아이템 수(0~1),
목표 개수/전체 블록 비율(0~2), `Moves / 테스트 클리어 Moves` 비율(0~3)을 합산합니다.
테스트 기록이 없으면 권장 클리어 Moves를 대신 사용합니다. 0~2 Easy, 3~5 Normal,
6~8 Hard, 9 이상 Expert입니다.

현재 Playtest는 인접 블록 교환으로 생긴 가로·세로 3개 이상 직선 매치 제거, 설정한 방향의
중력과 막힘 우회, Terrain 내구도·파괴, 빈 칸 리필, 연쇄 매치, 유효 교환의 Moves 차감,
Block 제거와 Terrain 파괴, 매치 칸의 Item 수집, 매치 칸 또는 인접 칸의 Gimmick 활성화를 계산합니다. Terrain은 같은 칸 또는 인접 4방향 매치마다 한 번 반응하며,
설정한 내구도만큼 반응하면 사라집니다. `제거 불가`로 설정한 Terrain은 반응하지 않습니다.
3-Match가 생기지 않는 교환은 되돌리고 Moves를 차감하지 않습니다. 자동 검증은 목표 달성에
유리한 교환을 고르는 휴리스틱 플레이이므로 실제 유저 클리어율을 대체하지 않고 1차 밸런스 지표로 사용합니다.

## 로컬 실행

정적 파일이므로 `dist` 폴더를 임의의 HTTP 서버로 실행하면 됩니다.

```bash
python -m http.server 4173 --directory dist
```

브라우저에서 `http://localhost:4173`을 엽니다.

