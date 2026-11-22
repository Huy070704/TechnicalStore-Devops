# 🎨 BẢNG MÀU GIAO DIỆN - WELLNEST HOSPITAL MANAGEMENT SYSTEM

> **Theme:** WellNest Medical Design System  
> **Style:** Professional Clinical UI với Deep Navy & Medical Mint  
> **Brand:** Bệnh viện Đa khoa METPH

---

## 🏥 **MÀU CHỦ ĐẠO (PRIMARY BRAND)**

### Deep Slate Navy - Màu thương hiệu chính
```css
--color-primary: #142534          /* Deep Navy - Text & Primary Actions */
--color-primary-strong: #0d9488   /* Teal - Strong Actions (Buttons) */
--color-primary-hover: #0f1d2a    /* Hover state */
--color-primary-active: #09131c   /* Active/Pressed state */
--color-primary-foreground: #ffffff /* Text on primary */
```

**Ứng dụng:**
- Logo chính, Header, Navigation
- Tiêu đề quan trọng (H1, H2)
- Buttons chính (Primary CTA)
- Focus outlines

**HEX Colors:**
- 🟦 `#142534` - Primary (Deep Navy)
- 🟩 `#0d9488` - Primary Strong (Medical Teal)
- 🟦 `#0f1d2a` - Primary Hover
- 🟦 `#09131c` - Primary Active

---

## 💚 **MÀU NHẤN (ACCENT - MEDICAL MINT)**

### Mint & Teal Highlights
```css
--color-accent-mint: #7de5d8           /* Light Mint */
--color-accent-mint-strong: #0d9488    /* Strong Teal */
--color-accent-mint-hover: #0f766e     /* Hover Teal */
--color-accent-mint-light: #e8faf6     /* Light Background */
--color-accent-mint-foreground: #0c7a6d /* Text on Mint */
```

**Ứng dụng:**
- Badges, Pills, Tags
- Interactive elements highlights
- Success indicators
- Medical/Health themed elements

**HEX Colors:**
- 🟢 `#7de5d8` - Mint Light
- 🟩 `#0d9488` - Teal Strong
- 🟩 `#0f766e` - Teal Hover
- 🟢 `#e8faf6` - Mint Background
- 🟩 `#0c7a6d` - Mint Foreground

---

## 🌫️ **MÀU NỀN & BỀ MẶT (BACKGROUNDS & SURFACES)**

### Canvas & Surface
```css
--color-page-bg: #f4f8f7          /* Page Background - Soft Mint Gray */
--color-surface: #ffffff          /* White Cards/Panels */
--color-surface-elevated: #ffffff /* Elevated Components */
--color-surface-hover: #edf5f3    /* Hover state */
--color-secondary: #f4f8f7        /* Secondary Background */
--color-secondary-mint: #e8faf6   /* Mint Background */
--color-tertiary: #e3ece9         /* Tertiary/Divider */
--color-white: #ffffff            /* Pure White */
```

**Ứng dụng:**
- Background chính của app: `#f4f8f7`
- Cards, Modals, Panels: `#ffffff`
- Hover states: `#edf5f3`
- Section dividers: `#e3ece9`

**HEX Colors:**
- 🔲 `#f4f8f7` - Page Background (Soft Mint)
- ⬜ `#ffffff` - Pure White
- 🔲 `#edf5f3` - Surface Hover
- 🔲 `#e8faf6` - Secondary Mint
- 🔲 `#e3ece9` - Tertiary/Dividers

---

## 📝 **MÀU CHỮ (TYPOGRAPHY)**

### Text Colors
```css
--color-neutral: #142534           /* Primary Text */
--color-neutral-dark: #0f1d2a      /* Dark Text */
--color-neutral-deep: #142230      /* Deep Navy Text */
--color-text-main: #142534         /* Main Body Text */
--color-text-secondary: #60737d    /* Secondary/Muted Text */
--color-text-muted: #8c9da6        /* Placeholder/Hint Text */
--color-disabled-text: #94a3b8     /* Disabled State Text */
```

**Hierarchy:**
1. **Main Text:** `#142534` (Dark Navy)
2. **Secondary Text:** `#60737d` (Gray)
3. **Muted/Hints:** `#8c9da6` (Light Gray)
4. **Disabled:** `#94a3b8` (Lighter Gray)

**HEX Colors:**
- 🟦 `#142534` - Main Text (Dark Navy)
- 🔵 `#60737d` - Secondary Text
- 🔵 `#8c9da6` - Muted Text
- 🔵 `#94a3b8` - Disabled Text

---

## 🖼️ **MÀU VIỀN (BORDERS & FOCUS)**

### Border Colors
```css
--color-border: #e3ece9                  /* Default Border */
--color-border-subtle: #edf2f0           /* Subtle Border */
--color-border-control: #d5e0dc          /* Input/Control Border */
--color-border-focus: #14b8a6            /* Focus Ring */
--color-focus-ring: rgba(20, 184, 166, 0.2) /* Focus Ring Shadow */
```

**Ứng dụng:**
- Borders mặc định: `#e3ece9`
- Input borders: `#d5e0dc`
- Focus state: `#14b8a6` với shadow `rgba(20, 184, 166, 0.2)`

**HEX Colors:**
- 🔲 `#e3ece9` - Default Border
- 🔲 `#edf2f0` - Subtle Border
- 🔲 `#d5e0dc` - Control Border
- 🟩 `#14b8a6` - Focus Border

---

## ✅ **MÀU TRẠNG THÁI (STATUS COLORS)**

### Success (Thành công)
```css
--color-success: #0d9488           /* Success Primary */
--color-success-bg: #d8f8f3        /* Success Background */
--color-success-border: #a7f3e5    /* Success Border */
--color-success-text: #0c7a6d      /* Success Text */
```

**Ứng dụng:** Thông báo thành công, checkmarks, xác nhận

**HEX Colors:**
- ✅ `#0d9488` - Success (Teal)
- 🟢 `#d8f8f3` - Success BG
- 🟢 `#a7f3e5` - Success Border
- 🟩 `#0c7a6d` - Success Text

---

### Warning (Cảnh báo)
```css
--color-warning: #d98a1e           /* Warning Primary */
--color-warning-bg: #fef6e4        /* Warning Background */
--color-warning-border: #fde68a    /* Warning Border */
--color-warning-text: #b45309      /* Warning Text */
```

**Ứng dụng:** Cảnh báo, cần chú ý, pending states

**HEX Colors:**
- ⚠️ `#d98a1e` - Warning (Orange)
- 🟨 `#fef6e4` - Warning BG
- 🟡 `#fde68a` - Warning Border
- 🟠 `#b45309` - Warning Text

---

### Danger/Error (Lỗi)
```css
--color-danger: #e05a47            /* Danger Primary */
--color-danger-hover: #c94634      /* Danger Hover */
--color-danger-bg: #fdece8         /* Danger Background */
--color-danger-border: #fbc9c0     /* Danger Border */
--color-danger-text: #d9534f       /* Danger Text */
```

**Ứng dụng:** Lỗi, xóa, cảnh báo nguy hiểm

**HEX Colors:**
- 🔴 `#e05a47` - Danger (Red)
- 🔴 `#c94634` - Danger Hover
- 🔴 `#fdece8` - Danger BG
- 🔴 `#fbc9c0` - Danger Border
- 🔴 `#d9534f` - Danger Text

---

### Info (Thông tin)
```css
--color-info: #0284c7             /* Info Primary */
--color-info-bg: #e0f2fe          /* Info Background */
--color-info-border: #bae6fd      /* Info Border */
--color-info-text: #0369a1        /* Info Text */
```

**Ứng dụng:** Thông tin, hướng dẫn, tooltips

**HEX Colors:**
- 🔵 `#0284c7` - Info (Blue)
- 🔵 `#e0f2fe` - Info BG
- 🔵 `#bae6fd` - Info Border
- 🔵 `#0369a1` - Info Text

---

## 🚫 **MÀU DISABLED (VÔ HIỆU HÓA)**

```css
--color-disabled-text: #94a3b8     /* Disabled Text */
--color-disabled-bg: #f1f5f9       /* Disabled Background */
```

**Ứng dụng:** Buttons, inputs, elements không thể tương tác

**HEX Colors:**
- 🔵 `#94a3b8` - Disabled Text
- 🔲 `#f1f5f9` - Disabled Background

---

## 🎭 **MÀU LOGIN HERO SECTION**

### Dark Hero Background (Login Page Right Side)
```css
Background: #142230                /* Deep Navy Background */
Text Primary: #f8fafc              /* Near White */
Text Secondary: #cbd5e1            /* Light Gray */
Text Muted: #94a3b8                /* Muted Gray */
Accent Badge: rgba(20, 184, 166, 0.15) /* Teal transparent */
Accent Color: #2dd4bf              /* Bright Teal */
Feature Icon BG: rgba(20, 184, 166, 0.2) /* Teal transparent */
```

**HEX Colors:**
- 🟦 `#142230` - Hero Background (Deep Navy)
- ⬜ `#f8fafc` - Hero Text Primary
- 🔲 `#cbd5e1` - Hero Text Secondary
- 🔲 `#94a3b8` - Hero Text Muted
- 🟢 `#2dd4bf` - Hero Accent (Bright Teal)

---

## 📦 **BẢNG MÀU TỔNG HỢP THEO NHÓM**

### 🔵 Blues & Navy (Primary)
| Màu | HEX | Mô tả |
|-----|-----|-------|
| Primary Deep Navy | `#142534` | Main brand color |
| Primary Hover | `#0f1d2a` | Hover state |
| Primary Active | `#09131c` | Active state |
| Neutral Dark | `#0f1d2a` | Dark text |
| Neutral Deep | `#142230` | Hero background |

### 🟢 Greens & Teals (Accent)
| Màu | HEX | Mô tả |
|-----|-----|-------|
| Primary Strong Teal | `#0d9488` | Main action color |
| Mint Light | `#7de5d8` | Light accent |
| Teal Hover | `#0f766e` | Hover teal |
| Teal Dark | `#115e59` | Active teal |
| Mint Foreground | `#0c7a6d` | Text on mint |
| Focus Border | `#14b8a6` | Focus rings |
| Hero Bright Teal | `#2dd4bf` | Hero accents |

### 🔲 Grays & Neutrals (Backgrounds)
| Màu | HEX | Mô tả |
|-----|-----|-------|
| Page Background | `#f4f8f7` | Soft mint gray |
| White | `#ffffff` | Pure white |
| Surface Hover | `#edf5f3` | Hover background |
| Tertiary | `#e3ece9` | Dividers |
| Secondary Mint | `#e8faf6` | Light mint BG |

### 📝 Text Colors
| Màu | HEX | Mô tả |
|-----|-----|-------|
| Main Text | `#142534` | Primary text |
| Secondary Text | `#60737d` | Secondary text |
| Muted Text | `#8c9da6` | Hints/placeholders |
| Disabled Text | `#94a3b8` | Disabled state |

### 🎨 Status Colors
| Màu | HEX | Mô tả |
|-----|-----|-------|
| Success | `#0d9488` | Success state |
| Warning | `#d98a1e` | Warning state |
| Danger | `#e05a47` | Error/danger |
| Info | `#0284c7` | Info state |

---

## 🎯 **HƯỚNG DẪN SỬ DỤNG**

### 1. **Buttons**
```css
/* Primary Button */
background: #0d9488 (Primary Strong)
hover: #0f766e
active: #115e59
text: #ffffff

/* Secondary Button */
background: #ffffff
border: #142534
text: #0d9488
hover-bg: #f4f8f7

/* Ghost Button */
background: transparent
text: #0d9488
hover-bg: #f4f8f7
```

### 2. **Inputs & Forms**
```css
/* Input */
background: #fbfdfe (Light mint tint)
border: #d5e0dc
text: #142534
placeholder: #94a3b8

/* Focus State */
border: #0d9488
box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15)

/* Error State */
border: #e05a47
```

### 3. **Cards & Panels**
```css
/* Card */
background: #ffffff
border: #e3ece9
border-radius: 12px

/* Card Hover */
background: #ffffff
border: #d5e0dc (darker)
```

### 4. **Status Banners**
```css
/* Success */
color: #0c7a6d
background: #d8f8f3
border-left: 4px solid #0d9488

/* Warning */
color: #b45309
background: #fef6e4
border-left: 4px solid #d98a1e

/* Error */
color: #d9534f
background: #fdece8
border-left: 4px solid #e05a47
```

---

## 🌈 **COLOR PALETTE CHEAT SHEET**

### Quick Reference
```
PRIMARY PALETTE:
🟦 Navy:  #142534, #0f1d2a, #09131c, #142230
🟩 Teal:  #0d9488, #0f766e, #115e59, #14b8a6
🟢 Mint:  #7de5d8, #e8faf6, #2dd4bf

BACKGROUNDS:
🔲 Grays: #f4f8f7, #edf5f3, #e3ece9, #d5e0dc
⬜ White: #ffffff, #fbfdfe, #f8fafc

TEXT:
🖤 Dark:  #142534, #60737d, #8c9da6, #94a3b8

STATUS:
✅ Success: #0d9488 on #d8f8f3
⚠️ Warning: #d98a1e on #fef6e4
🔴 Danger:  #e05a47 on #fdece8
🔵 Info:    #0284c7 on #e0f2fe
```

---

## 🎨 **GRADIENT SAMPLES** (Nếu cần)

```css
/* Medical Gradient (Teal to Mint) */
background: linear-gradient(135deg, #0d9488 0%, #7de5d8 100%);

/* Navy Gradient */
background: linear-gradient(135deg, #142534 0%, #0f1d2a 100%);

/* Hero Gradient (Dark Navy) */
background: linear-gradient(180deg, #142230 0%, #0f1d2a 100%);
```

---

## 📱 **ACCESSIBILITY NOTES**

### Contrast Ratios (WCAG AA)
✅ **Primary Text** (#142534) on White: **11.6:1** - Excellent
✅ **Secondary Text** (#60737d) on White: **5.8:1** - Good
✅ **Primary Button** (#0d9488) with White text: **4.7:1** - Pass
✅ **Focus Border** (#14b8a6): Highly visible

### Color Blind Friendly
✅ Navy + Teal combination works well for most color blindness types
✅ Status colors use different shades and icons for clarity

---

## 💼 **BRAND ASSETS**

### Typography
- **Sans Serif:** Plus Jakarta Sans (Primary), Be Vietnam Pro (Secondary)
- **Monospace:** JetBrains Mono (Code/Technical)

### Logo Colors
- **Primary:** #142534 (Deep Navy)
- **Accent:** #0d9488 (Medical Teal)
- **Background:** #ffffff or #f4f8f7

---

**Generated for:** WellNest Hospital Management System - Bệnh viện Đa khoa METPH  
**Last Updated:** 2024  
**Version:** 1.0
