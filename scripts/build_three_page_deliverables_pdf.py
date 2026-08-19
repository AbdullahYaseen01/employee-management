"""3-page client deliverables pack from the original technical task PDF."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

OUTPUT = Path(__file__).resolve().parents[1] / "Employee-Management-Deliverables-3-Pages.pdf"

NAVY = HexColor("#16324F")
NAVY_DEEP = HexColor("#0F2438")
TEAL = HexColor("#0F766E")
TEAL_SOFT = HexColor("#E7F6F3")
CORAL = HexColor("#C2410C")
CORAL_SOFT = HexColor("#FDEDE4")
AMBER = HexColor("#B45309")
AMBER_SOFT = HexColor("#FEF3C7")
GOLD = HexColor("#C9A227")
INDIGO = HexColor("#3730A3")
INDIGO_SOFT = HexColor("#EEF0FF")
CREAM = HexColor("#F6F1E6")
INK = HexColor("#15202B")
MUTED = HexColor("#5B6B76")
LINE = HexColor("#D8D0C2")
PAGE_BG = HexColor("#FBF8F2")

W, H = letter
ML, MR = 32, 32
CONTENT_W = W - ML - MR


def wrap(c: canvas.Canvas, text: str, font: str, size: float, max_w: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if c.stringWidth(trial, font, size) <= max_w:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [""]


def rounded(c: canvas.Canvas, x: float, y: float, w: float, h: float, r: float, fill: Color, stroke=None, sw=0.6) -> None:
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(sw)
        c.roundRect(x, y, w, h, r, fill=1, stroke=1)
    else:
        c.setStrokeColor(fill)
        c.roundRect(x, y, w, h, r, fill=1, stroke=0)


def header_bar(c: canvas.Canvas, page: int, kicker: str, title: str) -> None:
    c.setFillColor(NAVY)
    c.rect(0, H - 58, W, 58, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, H - 62, W, 4, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(0, H - 58, 8, 58, fill=1, stroke=0)
    c.setFillColor(HexColor("#9FE1D8"))
    c.setFont("Helvetica", 8)
    c.drawString(ML, H - 22, kicker.upper())
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(ML, H - 42, title)
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#C5D4DE"))
    c.drawRightString(W - MR, H - 34, f"Page {page} of 3")


def footer(c: canvas.Canvas) -> None:
    c.setFillColor(NAVY)
    c.rect(0, 0, W, 26, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, 26, W, 3, fill=1, stroke=0)
    c.setFillColor(HexColor("#D5E3EC"))
    c.setFont("Helvetica", 7)
    c.drawString(ML, 10, "Compiled from Employee_Management_Frontend_Technical_Task.pdf  |  No extra requirements added")
    c.drawRightString(W - MR, 10, "Client deliverables pack")


def paint_bg(c: canvas.Canvas) -> None:
    c.setFillColor(PAGE_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def draw_bullets(c: canvas.Canvas, items: list[str], x: float, y: float, max_w: float, color: Color, size=8.1, leading=11.2) -> float:
    for item in items:
        lines = wrap(c, item, "Helvetica", size, max_w - 12)
        c.setFillColor(color)
        c.circle(x + 3.2, y + 2.2, 1.7, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica", size)
        for i, line in enumerate(lines):
            c.drawString(x + 10, y, line)
            if i < len(lines) - 1:
                y -= leading
        y -= leading
    return y


def card_header(c: canvas.Canvas, x: float, y: float, w: float, h: float, color: Color, number: str, title: str, subtitle: str | None = None) -> None:
    rounded(c, x, y, w, h, 8, white, LINE, 0.5)
    c.setFillColor(color)
    c.roundRect(x, y + h - 28, w, 28, 8, fill=1, stroke=0)
    c.rect(x, y + h - 28, w, 10, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 10, y + h - 18, f"{number}  {title}")
    if subtitle:
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Oblique", 7.4)
        c.drawString(x + 10, y + h - 40, subtitle)


def page1(c: canvas.Canvas) -> None:
    paint_bg(c)

    # Hero
    c.setFillColor(NAVY_DEEP)
    c.rect(0, H - 214, W, 214, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.rect(0, H - 218, W, 4, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(0, H - 214, 10, 214, fill=1, stroke=0)

    c.setFillColor(HexColor("#7DDFD2"))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(ML + 6, H - 36, "FRONTEND TECHNICAL TASK")
    c.setFillColor(HexColor("#C5D4DE"))
    c.setFont("Helvetica", 8)
    c.drawRightString(W - MR, H - 36, "Page 1 of 3")

    c.setFillColor(white)
    c.setFont("Times-Bold", 26)
    c.drawString(ML + 6, H - 72, "Employee Management Page")
    c.setFont("Times-Italic", 13)
    c.setFillColor(HexColor("#D5E8E4"))
    c.drawString(ML + 6, H - 94, "Frontend Engineer  ·  Technical Assessment")

    # chips
    chips = [
        ("React + TypeScript", TEAL),
        ("No backend required", CORAL),
        ("Design is not the focus", GOLD),
    ]
    x = ML + 6
    y = H - 128
    for label, color in chips:
        tw = c.stringWidth(label, "Helvetica-Bold", 7.5) + 18
        rounded(c, x, y, tw, 18, 9, color)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x + 9, y + 5.5, label)
        x += tw + 8

    note = (
        "Design is not a focus of this task. Use any UI library, component library, "
        "CSS framework, or styling approach you prefer."
    )
    rounded(c, ML + 6, H - 198, CONTENT_W - 6, 50, 8, HexColor("#1E3D5C"))
    for i, line in enumerate(wrap(c, note, "Helvetica", 8.5, CONTENT_W - 28)):
        c.setFillColor(HexColor("#E4EEF4"))
        c.setFont("Helvetica", 8.5)
        c.drawString(ML + 18, H - 168 - i * 12, line)

    # Problem
    top = H - 246
    rounded(c, ML, 430, CONTENT_W, top - 430, 10, CREAM, HexColor("#E4D9C4"), 0.7)
    c.setFillColor(TEAL)
    c.rect(ML, 430, 7, top - 430, fill=1, stroke=0)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(ML + 20, top - 22, "THE PROBLEM STATEMENT")
    c.setFillColor(INK)
    c.setFont("Helvetica", 9)
    problem = (
        "HR teams need a simple way to quickly find and manage employees. Your goal is to build an "
        "Employee Management Page that allows HR users to search, filter, view, add, edit, and "
        "deactivate employees using React and TypeScript."
    )
    y = top - 42
    for line in wrap(c, problem, "Helvetica", 9, CONTENT_W - 36):
        c.drawString(ML + 20, y, line)
        y -= 13

    # Deliverables heading
    y = 400
    c.setFillColor(NAVY)
    c.setFont("Times-Bold", 16)
    c.drawString(ML, y, "What you must deliver")
    c.setStrokeColor(TEAL)
    c.setLineWidth(2)
    c.line(ML, y - 6, ML + 168, y - 6)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawString(ML + 180, y + 2, "Four client submissions from the original task")

    cards = [
        ("01", "Deployed Demo", TEAL, TEAL_SOFT, [
            "Provide a deployed demo using Vercel, Netlify, or an equivalent platform.",
            "The demo should show: employee list, search/filter, add employee, edit employee, deactivate employee, and loading/empty/error states.",
        ]),
        ("02", "GitHub Repository", NAVY, HexColor("#E8EEF4"), [
            "Provide a GitHub repository using TypeScript with a clean and understandable structure.",
            "You may use any libraries or tools you prefer. There are no restrictions on UI libraries, state management, form libraries, data-fetching libraries, or styling solutions.",
            "You may use mock data or a mock API. No backend implementation is required.",
        ]),
        ("03", "The Senior Touch", CORAL, CORAL_SOFT, [
            "Include a brief README.md explaining how you would handle the employee API being unavailable.",
            "Explain how you would approach the page if the company had 100,000+ employees.",
        ]),
        ("04", "AI Usage Disclosure", AMBER, AMBER_SOFT, [
            "You are encouraged to use GPT, Claude, Copilot, Cursor, or other AI tools.",
            "Please include a PROMPTS.md file containing the main prompts you used during the implementation.",
        ]),
    ]

    gap = 10
    cw = (CONTENT_W - gap) / 2
    ch = 158
    start_y = 48
    positions = [
        (ML, start_y + ch + gap),
        (ML + cw + gap, start_y + ch + gap),
        (ML, start_y),
        (ML + cw + gap, start_y),
    ]
    for (num, title, color, soft, items), (x, yb) in zip(cards, positions):
        rounded(c, x, yb, cw, ch, 10, white, LINE, 0.6)
        c.setFillColor(color)
        c.rect(x, yb, 6, ch, fill=1, stroke=0)
        rounded(c, x + 16, yb + ch - 28, 28, 16, 8, color)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(x + 30, yb + ch - 23, num)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 50, yb + ch - 23, title)
        draw_bullets(c, items, x + 16, yb + ch - 48, cw - 28, color, 7.9, 10.6)

    footer(c)


def req_card(
    c: canvas.Canvas,
    x: float,
    y: float,
    w: float,
    h: float,
    number: str,
    title: str,
    color: Color,
    items: list[str],
    note: str | None = None,
) -> None:
    rounded(c, x, y, w, h, 9, white, LINE, 0.55)
    c.setFillColor(color)
    c.roundRect(x, y + h - 26, w, 26, 9, fill=1, stroke=0)
    c.rect(x, y + h - 26, w, 8, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + 12, y + h - 17, f"{number}   {title}")
    ty = draw_bullets(c, items, x + 10, y + h - 44, w - 24, color, 8.0, 11.0)
    if note:
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Oblique", 7.4)
        for line in wrap(c, note, "Helvetica-Oblique", 7.4, w - 24):
            c.drawString(x + 12, ty - 2, line)
            ty -= 10


def page2(c: canvas.Canvas) -> None:
    paint_bg(c)
    header_bar(c, 2, "System requirements and constraints", "Product functionality you must build")
    footer(c)

    intro = (
        "Build an Employee Management Page in React and TypeScript. The original task does not require a backend. "
        "Mock data or a mock API is allowed."
    )
    rounded(c, ML, H - 118, CONTENT_W, 36, 8, TEAL_SOFT, TEAL, 0.6)
    c.setFillColor(INK)
    c.setFont("Helvetica", 8.3)
    y = H - 98
    for line in wrap(c, intro, "Helvetica", 8.3, CONTENT_W - 20):
        c.drawString(ML + 10, y, line)
        y -= 11

    gap = 10
    cw = (CONTENT_W - gap) / 2
    top = H - 132
    h1 = 248
    h2 = 248
    req_card(
        c, ML, top - h1, cw, h1, "01", "Employee List", TEAL,
        [
            "Display: Name, Employee ID, Job Title, Department, Status, Joining Date, and Actions.",
            "Search by employee name.",
            "Filter by department.",
            "Filter by employment status.",
            "Pagination.",
        ],
    )
    req_card(
        c, ML + cw + gap, top - h1, cw, h1, "02", "Employee Form", CORAL,
        [
            "Implement a form for adding and editing employees.",
            "Fields: First Name, Last Name, Email, Job Title, Department, Employment Status, and Joining Date.",
            "Add appropriate validation for required fields and email format.",
            "The same form should be reusable for both Create and Edit.",
        ],
    )
    bottom = 42
    req_card(
        c, ML, bottom, cw, h2, "03", "State Management & Data Flow", INDIGO,
        [
            "Keep employee data and UI state maintainable and avoid unnecessary prop drilling.",
            "Handle loading state while fetching employees.",
            "Handle an empty state when no employees match the filters.",
            "Handle an error state when fetching employees fails.",
            "Handle loading state during create/edit operations.",
        ],
    )
    req_card(
        c, ML + cw + gap, bottom, cw, h2, "04", "Employee Actions", AMBER,
        [
            "View employee details.",
            "Edit an employee.",
            "Deactivate an employee.",
            "Deactivation should require a confirmation before the action is performed.",
        ],
    )


def page3(c: canvas.Canvas) -> None:
    paint_bg(c)
    header_bar(c, 3, "Quality, documentation, and client pack", "Remaining requirements and required files")
    footer(c)

    gap = 9
    cw = (CONTENT_W - gap) / 2
    pack_h, pack_y = 72, 36
    block_h = 112
    sb_h = 60
    row_h = 122
    top = H - 78

    req_card(
        c, ML, top - row_h, cw, row_h, "05", "Responsive UI", TEAL,
        [
            "The page should work on both desktop and mobile.",
            "The choice of responsive layout and styling approach is completely up to you.",
        ],
    )
    req_card(
        c, ML + cw + gap, top - row_h, cw, row_h, "06", "Error Handling", CORAL,
        [
            "Demonstrate how the UI behaves when an API operation fails.",
            "Provide a clear recovery mechanism such as a Retry button or allowing the user to try the action again.",
        ],
    )
    y2 = top - row_h - gap - row_h
    req_card(
        c, ML, y2, cw, row_h, "07", "Accessibility", INDIGO,
        [
            "Form fields have accessible labels.",
            "Buttons have meaningful accessible names.",
            "Main interactions are keyboard accessible.",
            "Validation errors are clearly communicated.",
        ],
    )
    req_card(
        c, ML + cw + gap, y2, cw, row_h, "08", "Testing", AMBER,
        [
            "Include at least one meaningful automated test demonstrating your testing approach.",
        ],
    )

    sb_y = y2 - gap - sb_h
    rounded(c, ML, sb_y, CONTENT_W, sb_h, 9, AMBER_SOFT, GOLD, 0.8)
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(ML + 12, sb_y + sb_h - 16, "STORYBOOK  ·  NICE TO HAVE  ·  NOT REQUIRED")
    c.setFillColor(INK)
    c.setFont("Helvetica", 8.1)
    sb = (
        "Adding Storybook is not required, but it is a nice addition. If you choose to include it, showcase key "
        "reusable components and their main states, such as loading, empty, error, and populated states."
    )
    yy = sb_y + sb_h - 32
    for line in wrap(c, sb, "Helvetica", 8.1, CONTENT_W - 24):
        c.drawString(ML + 12, yy, line)
        yy -= 11

    by = sb_y - gap - block_h
    rounded(c, ML, by, cw, block_h, 9, CORAL_SOFT, CORAL, 0.55)
    c.setFillColor(CORAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(ML + 12, by + block_h - 18, "SENIOR TOUCH  ·  README.md")
    draw_bullets(
        c,
        [
            "Include a brief README.md explaining how you would handle the employee API being unavailable.",
            "Explain how you would approach the page if the company had 100,000+ employees.",
        ],
        ML + 10,
        by + block_h - 38,
        cw - 22,
        CORAL,
        8.0,
        11.2,
    )

    rounded(c, ML + cw + gap, by, cw, block_h, 9, TEAL_SOFT, TEAL, 0.55)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(ML + cw + gap + 12, by + block_h - 18, "AI USAGE  ·  PROMPTS.md")
    draw_bullets(
        c,
        [
            "You are encouraged to use GPT, Claude, Copilot, Cursor, or other AI tools.",
            "Please include a PROMPTS.md file containing the main prompts you used during the implementation.",
        ],
        ML + cw + gap + 10,
        by + block_h - 38,
        cw - 22,
        TEAL,
        8.0,
        11.2,
    )

    demo_y = pack_y + pack_h + 8
    demo_h = by - gap - demo_y
    if demo_h >= 56:
        rounded(c, ML, demo_y, CONTENT_W, demo_h, 9, TEAL_SOFT, TEAL, 0.6)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(ML + 12, demo_y + demo_h - 16, "LIVE DEMO MUST SHOW")
        chips = [
            ("Employee list", TEAL),
            ("Search / filter", NAVY),
            ("Add employee", CORAL),
            ("Edit employee", INDIGO),
            ("Deactivate", AMBER),
            ("Loading / empty / error", GOLD),
        ]
        x = ML + 12
        cy = demo_y + 14
        for label, color in chips:
            tw = c.stringWidth(label, "Helvetica-Bold", 7.4) + 16
            if x + tw > ML + CONTENT_W - 12:
                x = ML + 12
                cy -= 22
            rounded(c, x, cy, tw, 16, 8, color)
            c.setFillColor(white)
            c.setFont("Helvetica-Bold", 7.4)
            c.drawString(x + 8, cy + 4.5, label)
            x += tw + 7
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Oblique", 7.2)
        note = (
            "This delivery also includes create-form reset after save, close locked during in-flight "
            "mutations, stale error reset on close, wrapping filters, and a teal/navy HR visual treatment. "
            "Required workflows are unchanged. 21 automated tests pass."
        )
        ny = cy - 16
        for line in wrap(c, note, "Helvetica-Oblique", 7.2, CONTENT_W - 24):
            if ny > demo_y + 8:
                c.drawString(ML + 12, ny, line)
                ny -= 9

    rounded(c, ML, pack_y, CONTENT_W, pack_h, 8, NAVY)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(ML + 12, pack_y + 54, "SUBMITTED CLIENT PACK")
    c.setFillColor(white)
    c.setFont("Helvetica", 8)
    c.drawString(ML + 12, pack_y + 36, "Live demo    https://employee-management-eta-one.vercel.app")
    c.drawString(ML + 12, pack_y + 22, "GitHub         https://github.com/AbdullahYaseen01/employee-management")
    c.setFillColor(HexColor("#C5D4DE"))
    c.drawString(ML + 12, pack_y + 8, "Also included: README.md Senior Touch  ·  PROMPTS.md AI disclosure")


def build() -> None:
    c = canvas.Canvas(
        str(OUTPUT),
        pagesize=letter,
    )
    c.setTitle("Employee Management Page — Client Deliverables")
    c.setAuthor("Frontend Technical Assessment")
    c.setSubject("Client deliverables compiled from the original Employee Management technical task")

    page1(c)
    c.showPage()
    page2(c)
    c.showPage()
    page3(c)
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
