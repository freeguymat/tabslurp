# Highlight Route

Base path: `/highlight`

Allows tabs to be color-highlighted for visual grouping and quick identification.

## Endpoints

### `GET /highlight/colors`
Returns the list of valid highlight colors.

**Response:**
```json
{ "colors": ["red", "orange", "yellow", "green", "blue", "purple", "pink", "gray"] }
```

---

### `POST /highlight`
Highlight a single tab.

**Body:** `{ tab: Tab, color: string }`

**Response:** `{ success: true, highlight: { tabId, color, highlightedAt } }`

---

### `POST /highlight/bulk`
Highlight multiple tabs with the same color.

**Body:** `{ tabs: Tab[], color: string }`

**Response:** `{ success: true, highlighted: number, highlights: [...] }`

---

### `DELETE /highlight/:tabId`
Remove highlight from a specific tab.

**Response:** `{ success: true, removed: boolean }`

---

### `GET /highlight/status/:tabId`
Check if a tab is highlighted and get its color.

**Response:** `{ tabId, highlighted: boolean, color: string | null }`

---

### `POST /highlight/query`
Get highlighted tabs from a provided list, optionally filtered by color.

**Body:** `{ tabs: Tab[], color?: string }`

**Response:** `{ count: number, tabs: Tab[] }`

---

### `DELETE /highlight`
Clear all highlights.

**Response:** `{ success: true, message: string }`
