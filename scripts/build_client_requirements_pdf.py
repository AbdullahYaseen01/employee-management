"""Generate the client-ready Employee Management requirements PDF."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

NAVY = HexColor("#1B3654")
TEAL = HexColor("#0F766E")
INK = HexColor("#13212B")
MUTED = HexColor("#5A6872")
RULE = HexColor("#D9D0BE")
CREAM = HexColor("#F4F0E6")
SOFT = HexColor("#E7F4EF")
ACCENT = HexColor("#C45C26")

OUTPUT = Path(__file__).resolve().parents[1] / "Employee-Management-Client-Deliverables.pdf"


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_kicker": ParagraphStyle(
            "cover_kicker",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=10,
            textColor=TEAL,
            alignment=TA_LEFT,
            spaceAfter=10,
        ),
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Times-Bold",
            fontSize=28,
            leading=34,
            textColor=white,
            alignment=TA_LEFT,
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=13,
            leading=18,
            textColor=HexColor("#D7E8E4"),
            spaceAfter=0,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=MUTED,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Times-Bold",
            fontSize=16,
            leading=20,
            textColor=NAVY,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Times-Bold",
            fontSize=12.5,
            leading=16,
            textColor=TEAL,
            spaceBefore=12,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=14,
            textColor=NAVY,
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13.5,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        ),
        "toc": ParagraphStyle(
            "toc",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=16,
            textColor=INK,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=INK,
            leftIndent=4,
        ),
        "note": ParagraphStyle(
            "note",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12.5,
            textColor=NAVY,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            textColor=MUTED,
            spaceAfter=10,
        ),
        "code": ParagraphStyle(
            "code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=8,
            leading=11,
            textColor=INK,
            backColor=CREAM,
            leftIndent=6,
            rightIndent=6,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
        ),
        "header": ParagraphStyle(
            "header",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=NAVY,
        ),
        "header_right": ParagraphStyle(
            "header_right",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_RIGHT,
        ),
        "center": ParagraphStyle(
            "center",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
    }


def bullets(items: list[str], s: dict[str, ParagraphStyle]) -> ListFlowable:
    return ListFlowable(
        [
            ListItem(Paragraph(item, s["bullet"]), leftIndent=12, bulletColor=TEAL)
            for item in items
        ],
        bulletType="bullet",
        start="bulletchar",
        bulletFontName="Helvetica",
        bulletFontSize=8,
        leftIndent=16,
        bulletOffsetY=-1,
        spaceAfter=8,
    )


def callout(text: str, s: dict[str, ParagraphStyle]) -> Table:
    inner = Paragraph(text, s["note"])
    table = Table([[inner]], colWidths=[7.0 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                ("BOX", (0, 0), (-1, -1), 0.5, TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return table


def header_footer(canvas, doc) -> None:
    canvas.saveState()
    width, height = letter
    if doc.page > 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, height - 0.38 * inch, width, 0.38 * inch, fill=1, stroke=0)
        canvas.setFillColor(TEAL)
        canvas.rect(0, height - 0.42 * inch, width, 0.04 * inch, fill=1, stroke=0)
        canvas.setFillColor(white)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(0.75 * inch, height - 0.26 * inch, "Employee Management Technical Assessment")
        canvas.drawRightString(width - 0.75 * inch, height - 0.26 * inch, "Client Deliverables")
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.4)
        canvas.line(0.75 * inch, 0.55 * inch, width - 0.75 * inch, 0.55 * inch)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 8)
        canvas.drawString(0.75 * inch, 0.38 * inch, "Do not add requirements beyond the original technical task.")
        canvas.drawRightString(width - 0.75 * inch, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover(s: dict[str, ParagraphStyle]) -> list:
    banner = Table(
        [
            [
                Paragraph("TECHNICAL ASSESSMENT", s["cover_kicker"]),
            ],
            [Paragraph("Employee Management<br/>Frontend", s["cover_title"])],
            [
                Paragraph(
                    "Client deliverables, product requirements, and acceptance criteria compiled from the original technical task.",
                    s["cover_sub"],
                )
            ],
        ],
        colWidths=[7.0 * inch],
    )
    banner.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("LEFTPADDING", (0, 0), (-1, -1), 22),
                ("RIGHTPADDING", (0, 0), (-1, -1), 22),
                ("TOPPADDING", (0, 0), (0, 0), 28),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 28),
                ("TOPPADDING", (0, 1), (-1, 1), 4),
                ("BOTTOMPADDING", (0, 0), (0, 0), 0),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    stripe = Table([[""]], colWidths=[7.0 * inch], rowHeights=[8])
    stripe.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), TEAL)]))
    return [
        Spacer(1, 1.4 * inch),
        banner,
        stripe,
        Spacer(1, 0.45 * inch),
        Paragraph("Document type: Client deliverables and requirements pack", s["cover_meta"]),
        Paragraph("Audience: Hiring team, reviewer, and implementing engineer", s["cover_meta"]),
        Paragraph("Scope: React and TypeScript Employee Management frontend", s["cover_meta"]),
        Paragraph("Backend: Not required. A replaceable mock API is required.", s["cover_meta"]),
        Spacer(1, 0.35 * inch),
        callout(
            "<b>Compilation note.</b> This document restates the original technical assessment. "
            "It does not add product rules, business constraints, or submission steps that were not specified in that task.",
            s,
        ),
        Spacer(1, 1.6 * inch),
        Paragraph("Confidential  |  For assessment review only", s["center"]),
    ]


def toc(s: dict[str, ParagraphStyle]) -> list:
    items = [
        "1. Purpose and core objective",
        "2. Required client submissions",
        "3. Technology baseline",
        "4. Architecture",
        "5. Employee model and API contract",
        "6. Required product functionality",
        "7. Loading, empty, error, and demo states",
        "8. State management and data flow",
        "9. Visual design and responsive behavior",
        "10. Accessibility",
        "11. Testing",
        "12. Storybook",
        "13. README.md requirements",
        "14. PROMPTS.md / AI usage requirement",
        "15. Senior Touch requirements",
        "16. Deployment and validation",
        "17. Manual QA and definition of done",
        "18. Final delivery report",
    ]
    flow = [Paragraph("Contents", s["h1"])]
    for item in items:
        flow.append(Paragraph(item, s["toc"]))
    return flow


def build() -> None:
    s = styles()
    story: list = []
    story.extend(cover(s))
    story.append(PageBreak())
    story.extend(toc(s))
    story.append(PageBreak())

    story.append(Paragraph("1. Purpose and core objective", s["h1"]))
    story.append(
        Paragraph(
            "Build a complete, production-quality Employee Management frontend that allows HR users to view employees, "
            "search by name, filter by department, filter by employment status, paginate results, view employee details, "
            "add an employee, edit an employee, deactivate an employee after confirmation, and recover from loading, empty, "
            "validation, and API error states.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "No backend is required. The mock API must be designed so that it can later be replaced by a real backend without rewriting the feature.",
            s["body"],
        )
    )

    story.append(Paragraph("2. Required client submissions", s["h1"]))
    story.append(
        Paragraph(
            "The original task requires a working application plus documentation that a reviewer can use without additional explanation. The following submissions are required.",
            s["body"],
        )
    )

    story.append(Paragraph("2.1 Live deployed demo", s["h2"]))
    story.append(
        Paragraph(
            "Prepare the application for Vercel, Netlify, or equivalent static deployment. The deployed assessment must satisfy all of the following:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Production build succeeds.",
                "Client-side routing works after refresh if routing is used.",
                "Mock API works in the deployed demo.",
                "Environment configuration is documented.",
                "No secret is committed.",
                "Demo-state controls work in the deployed assessment.",
                "Provide appropriate deployment configuration only when needed.",
            ],
            s,
        )
    )
    story.append(
        Paragraph(
            "If deployment credentials and an authorized target are available, deploy and record the URL. Otherwise, prepare the repository so deployment is a direct import/build operation and provide exact steps.",
            s["body"],
        )
    )

    story.append(Paragraph("2.2 Source repository", s["h2"]))
    story.append(
        Paragraph(
            "Provide a complete source repository, typically hosted on GitHub, containing the implementation, tests, mock API, and documentation. The repository must be suitable for clone or direct import into Vercel, Netlify, or an equivalent static host.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Preserve unrelated code and user changes in an existing repository; do not replace an existing framework unnecessarily.",
                "Do not create competing lock files. Use the package manager already selected by the repository.",
                "No secret, credential, or real employee personal data may be committed.",
                "Seed or demo records must be fictional.",
                "Include README.md and PROMPTS.md as specified below.",
                "Include deployment configuration only when needed for static hosting and client-side routing.",
            ],
            s,
        )
    )

    story.append(Paragraph("2.3 README.md", s["h2"]))
    story.append(
        Paragraph(
            "Create or update README.md with the sections listed in Section 13 of this document, including the required Senior Touch sections.",
            s["body"],
        )
    )

    story.append(Paragraph("2.4 PROMPTS.md / AI usage disclosure", s["h2"]))
    story.append(
        Paragraph(
            "Create PROMPTS.md as specified in Section 14. It must document AI usage without credentials, secrets, employee personal data, or private repository information.",
            s["body"],
        )
    )

    story.append(Paragraph("3. Technology baseline", s["h1"]))
    story.append(
        Paragraph(
            "Before editing, inspect the existing project structure and package configuration. Detect the installed React, TypeScript, routing, styling, state-management, form, validation, testing, and data-fetching tools. Reuse existing libraries and conventions where suitable.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "If the repository is empty or lacks a suitable frontend, use:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "React.",
                "TypeScript with strict mode.",
                "Vite.",
                "TanStack Query for server state.",
                "React Hook Form for forms.",
                "Zod for schema validation.",
                "MSW or an equivalent mock API layer.",
                "Vitest.",
                "React Testing Library.",
                "@testing-library/user-event.",
                "An accessible component system already installed, or a lightweight styling solution compatible with the repository.",
            ],
            s,
        )
    )
    story.append(
        Paragraph(
            "Avoid adding a global state library unless the application genuinely requires one. Use TanStack Query for API state, URL search parameters for list state, and local component state for temporary UI state.",
            s["body"],
        )
    )

    story.append(Paragraph("4. Architecture", s["h1"]))
    story.append(
        Paragraph(
            "Use a feature-oriented, understandable structure. Adapt names to the existing repository. A suitable layout is:",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "src/app, src/components/ui, src/features/employees/{api, components, hooks, schemas, types, utils, pages, __tests__}, src/mocks, src/test",
            s["code"],
        )
    )
    story.append(Paragraph("Separate the following concerns. Do not place all behavior in one component:", s["body"]))
    story.append(
        bullets(
            [
                "Domain types.",
                "API/repository interface.",
                "Mock API implementation.",
                "Query and mutation hooks.",
                "Reusable form schema.",
                "Reusable UI components.",
                "Page-level orchestration.",
                "Tests.",
            ],
            s,
        )
    )

    story.append(Paragraph("5. Employee model and API contract", s["h1"]))
    story.append(Paragraph("5.1 Employee model", s["h2"]))
    story.append(
        Paragraph(
            "Use a typed model equivalent to: id, employeeId, firstName, lastName, email, jobTitle, department, employmentStatus, and joiningDate. Employment status values are active, inactive, and on_leave.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Use a derived full name instead of storing duplicate name values.",
                "Employee IDs should be generated by the mock API and shown as read-only data when editing.",
                "Use enums or typed constants for departments and statuses rather than repeating raw strings.",
            ],
            s,
        )
    )

    story.append(Paragraph("5.2 API operations", s["h2"]))
    story.append(
        Paragraph(
            "Create an employee API or repository contract with operations equivalent to listEmployees(params), getEmployee(id), createEmployee(payload), updateEmployee(id, payload), and deactivateEmployee(id).",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "The list request must support search query, department, employment status, page, page size, and abort signal where supported.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "Return pagination metadata: items, page, pageSize, totalItems, and totalPages.",
            s["body"],
        )
    )

    story.append(Paragraph("5.3 Mock API", s["h2"]))
    story.append(
        bullets(
            [
                "Simulate realistic latency.",
                "Support pagination.",
                "Search names case-insensitively.",
                "Filter by department and status.",
                "Create, update, and deactivate employees.",
                "Return meaningful typed errors.",
                "Be replaceable by a real HTTP implementation.",
                "Include enough seed employees to demonstrate pagination and filters.",
                "Preserve modifications during the browser session.",
                "Optionally use local storage if implemented cleanly.",
                "Do not call mock data directly from UI components.",
            ],
            s,
        )
    )

    story.append(Paragraph("6. Required product functionality", s["h1"]))
    story.append(Paragraph("6.1 Employee list page", s["h2"]))
    story.append(Paragraph("Page header", s["h3"]))
    story.append(
        bullets(
            [
                "Page title: Employees.",
                "Short supporting text.",
                "Total employee count.",
                "Primary Add employee button.",
            ],
            s,
        )
    )
    story.append(Paragraph("Search and filters", s["h3"]))
    story.append(
        bullets(
            [
                "Search input for employee name.",
                "Department filter.",
                "Employment status filter.",
                "Clear filters action.",
                "Page-size selector if it fits the current component system.",
                "Debounce search by approximately 250-350ms.",
                "Keep the visible input responsive while querying.",
                "Store search, filters, page, and page size in URL search parameters.",
                "Reset page to one when search or filters change.",
                "Preserve filters across refresh and browser navigation.",
                "Do not issue stale requests after parameters change.",
                "Show an active-filter summary when filters are applied.",
            ],
            s,
        )
    )
    story.append(Paragraph("Desktop list", s["h3"]))
    story.append(
        Paragraph(
            "Display columns for Name, Employee ID, Job Title, Department, Status, Joining Date, and Actions.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Use semantic table markup.",
                "Use stable row keys.",
                "Format dates consistently.",
                "Use accessible status badges.",
                "Do not rely on badge color alone.",
                "Keep actions keyboard accessible.",
                "Use a compact action menu or clearly labeled buttons.",
            ],
            s,
        )
    )
    story.append(Paragraph("Mobile list", s["h3"]))
    story.append(
        Paragraph(
            "Do not force users to navigate a wide desktop table. Use responsive employee cards containing name, employee ID, job title, department, status, joining date, and an accessible action menu. Search, filters, add, view, edit, and deactivate must remain usable on small screens.",
            s["body"],
        )
    )
    story.append(Paragraph("Pagination", s["h3"]))
    story.append(
        bullets(
            [
                "Previous and Next controls.",
                "Current page and total pages.",
                "Result range, for example 21-40 of 137.",
                "Disabled states when navigation is unavailable.",
                "Use buttons rather than clickable non-semantic elements.",
            ],
            s,
        )
    )

    story.append(Paragraph("6.2 Employee details", s["h2"]))
    story.append(
        Paragraph(
            "Implement View employee using an accessible dialog, drawer, or dedicated route consistent with the existing architecture. Display full name, employee ID, email, job title, department, employment status, and joining date.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Close action.",
                "Edit action.",
                "Deactivate action when the employee is active.",
                "Appropriate status representation.",
                "Keyboard focus management.",
                "Escape-key behavior when using a dialog.",
                "Focus restoration when closed.",
            ],
            s,
        )
    )

    story.append(Paragraph("6.3 Reusable employee form", s["h2"]))
    story.append(
        Paragraph(
            "Create one reusable form component for both Create and Edit modes. Fields: First Name, Last Name, Email, Job Title, Department, Employment Status, and Joining Date.",
            s["body"],
        )
    )
    story.append(Paragraph("Validation", s["h3"]))
    story.append(
        bullets(
            [
                "Every field is required.",
                "Trim leading and trailing whitespace.",
                "Validate email format.",
                "Reject whitespace-only names and job titles.",
                "Validate that joining date is a valid date.",
                "Do not invent unnecessary business restrictions not requested by the specification.",
            ],
            s,
        )
    )
    story.append(Paragraph("Behavior", s["h3"]))
    story.append(
        bullets(
            [
                "Create mode starts with clear defaults.",
                "Edit mode loads the selected employee.",
                "The same validation schema must serve both modes.",
                "Prevent duplicate submissions.",
                "Disable submit while saving.",
                "Display a progress state during create and edit.",
                "Show field-level validation messages.",
                "Show a form-level API error when submission fails.",
                "Keep entered values when the API fails.",
                "Allow retry without reopening the form.",
                "Close only after successful completion.",
                "Refresh or update the employee list after success.",
                "Show a success notification.",
                "Return focus to the initiating control.",
                "Use correct labels, descriptions, autocomplete attributes, input types, and error relationships.",
            ],
            s,
        )
    )

    story.append(Paragraph("6.4 Deactivation", s["h2"]))
    story.append(
        Paragraph(
            "Implement deactivation as a dedicated mutation. Before performing the action, show an accessible confirmation dialog containing the employee name, employee ID, a clear statement that status will become inactive, a Cancel action, and a destructive Deactivate employee action.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Do not deactivate before confirmation.",
                "Prevent duplicate requests.",
                "Show a loading state on the destructive button.",
                "Disable relevant controls during the request.",
                "Close the dialog only after success.",
                "Update the list and detail view after success.",
                "Show a success notification.",
                "If the request fails, keep the dialog open.",
                "Display a clear error.",
                "Allow retry.",
                "Do not leave the UI showing the employee as inactive when the operation failed.",
                "Hide or disable deactivation for employees already inactive.",
            ],
            s,
        )
    )

    story.append(Paragraph("7. Loading, empty, error, and demo states", s["h1"]))
    story.append(Paragraph("7.1 Required UI states", s["h2"]))
    story.append(Paragraph("Initial loading", s["h3"]))
    story.append(
        bullets(
            [
                "Display table-row or card skeletons.",
                "Do not show an empty-state message while data is loading.",
            ],
            s,
        )
    )
    story.append(Paragraph("Background refetch", s["h3"]))
    story.append(
        bullets(
            [
                "Keep existing data visible.",
                "Show a subtle progress indicator.",
                "Avoid replacing the entire page with a spinner.",
            ],
            s,
        )
    )
    story.append(Paragraph("Empty dataset", s["h3"]))
    story.append(
        Paragraph(
            "When there are no employees at all: explain that no employees have been added, and provide an Add employee action.",
            s["body"],
        )
    )
    story.append(Paragraph("No search/filter results", s["h3"]))
    story.append(
        Paragraph(
            "When employees exist but none match: explain that no employees match the current criteria, provide Clear filters, and do not use the same message as the completely empty dataset.",
            s["body"],
        )
    )
    story.append(Paragraph("Fetch error", s["h3"]))
    story.append(
        bullets(
            [
                "Clear error title.",
                "Short useful explanation.",
                "Retry button.",
                "Existing cached data when available.",
                "Non-blocking error banner when stale data can still be displayed.",
            ],
            s,
        )
    )
    story.append(Paragraph("Mutation error", s["h3"]))
    story.append(
        bullets(
            [
                "Create/edit errors remain in the form.",
                "Deactivation errors remain in the confirmation dialog.",
                "Preserve user input.",
                "Provide retry.",
            ],
            s,
        )
    )

    story.append(Paragraph("7.2 Demo-state controls", s["h2"]))
    story.append(
        Paragraph(
            "The deployed assessment must demonstrate loading, empty, error, and populated states. Implement a discrete demo-state mechanism that does not pollute the primary HR interface. Acceptable approaches: development/demo toolbar, query parameter, small Demo states menu, or mock API controls available only in mock/demo mode.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Normal populated state.",
                "Slow loading.",
                "Empty data.",
                "Fetch failure.",
                "Create failure.",
                "Edit failure.",
                "Deactivation failure.",
                "Reset mock data.",
            ],
            s,
        )
    )
    story.append(
        Paragraph(
            "The normal default state must remain realistic and usable.",
            s["body"],
        )
    )

    story.append(Paragraph("8. State management and data flow", s["h1"]))
    story.append(
        Paragraph(
            "Maintain clear separation between server data, list query state, form state, dialog state, and notifications.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Avoid unnecessary prop drilling.",
                "Use feature hooks for queries and mutations.",
                "Centralize query keys.",
                "Invalidate or update cached data correctly.",
                "Cancel or ignore stale list requests.",
                "Do not duplicate server data in global client state.",
                "Keep filters in the URL.",
                "Keep form values in the form system.",
                "Use memoization only where it has demonstrated value.",
                "Avoid premature abstraction.",
            ],
            s,
        )
    )

    story.append(Paragraph("9. Visual design and responsive behavior", s["h1"]))
    story.append(Paragraph("9.1 Visual design", s["h2"]))
    story.append(
        Paragraph(
            "Although visual design is not the primary assessment criterion, deliver a polished senior-level interface: a modern HR operations dashboard that is professional, elegant, premium, and restrained.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Light neutral background.",
                "White elevated surfaces.",
                "Deep navy or slate primary text.",
                "Indigo/blue primary action color.",
                "Emerald active status.",
                "Amber leave status.",
                "Muted red inactive/destructive status.",
                "Consistent spacing and typography.",
                "Subtle borders and shadows.",
                "Approximately 12-16px card radii.",
                "Clear hover, focus, active, disabled, loading, success, and error states.",
                "No unnecessary gradients, glass effects, or decorative animation.",
            ],
            s,
        )
    )
    story.append(
        Paragraph(
            "Create reusable design tokens for colors, typography, spacing, radii, shadows, borders, and breakpoints. Support light mode first. Support dark mode only if the existing application already supports it or it can be added without risking the core deliverables.",
            s["body"],
        )
    )

    story.append(Paragraph("9.2 Responsive behavior", s["h2"]))
    story.append(
        Paragraph(
            "Verify at minimum 320px mobile, 375px mobile, 768px tablet, 1024px laptop, and 1440px desktop.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "No horizontal page overflow.",
                "Form controls remain readable.",
                "Dialogs fit within the viewport.",
                "Long names, titles, departments, and emails wrap or truncate accessibly.",
                "Filters stack cleanly on mobile.",
                "Add employee remains visible.",
                "Mobile cards expose every required field and action.",
                "Pagination remains usable on mobile.",
            ],
            s,
        )
    )

    story.append(Paragraph("10. Accessibility", s["h1"]))
    story.append(
        Paragraph(
            "Meet practical WCAG 2.1 AA expectations.",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Semantic page structure.",
                "One clear page heading.",
                "Accessible table markup.",
                "Associated form labels.",
                "Meaningful accessible button names.",
                "Visible keyboard focus indicators.",
                "Keyboard-accessible menus and dialogs.",
                "Correct dialog focus trapping.",
                "Escape-to-close where appropriate.",
                "Focus restoration.",
                "Validation errors associated with their fields.",
                "Error summary or form-level message when appropriate.",
                "aria-live announcements for asynchronous success and error feedback.",
                "Color-independent status identification.",
                "Sufficient color contrast.",
                "Minimum touch targets.",
                "No inaccessible icon-only buttons.",
                "Screen-reader-friendly loading and empty states.",
                "Reduced-motion support for any animations.",
            ],
            s,
        )
    )

    story.append(Paragraph("11. Testing", s["h1"]))
    story.append(
        Paragraph(
            "Include more than the minimum single test. Use the existing test stack or Vitest and React Testing Library. Add meaningful tests for the areas below. Avoid tests coupled to internal implementation details.",
            s["body"],
        )
    )
    story.append(Paragraph("Employee list", s["h3"]))
    story.append(
        bullets(
            [
                "Renders employee data.",
                "Search filters by employee name.",
                "Department filter works.",
                "Employment-status filter works.",
                "Clear filters works.",
                "Pagination changes results.",
                "URL parameters reflect list state.",
            ],
            s,
        )
    )
    story.append(Paragraph("Loading, empty, and error", s["h3"]))
    story.append(
        bullets(
            [
                "Loading skeleton appears.",
                "Empty dataset state appears.",
                "No-match state appears.",
                "Fetch error displays retry.",
                "Retry successfully reloads data.",
            ],
            s,
        )
    )
    story.append(Paragraph("Create form", s["h3"]))
    story.append(
        bullets(
            [
                "Required-field validation.",
                "Invalid email validation.",
                "Successful employee creation.",
                "Submission loading state.",
                "API failure preserves values and permits retry.",
            ],
            s,
        )
    )
    story.append(Paragraph("Edit form", s["h3"]))
    story.append(
        bullets(
            [
                "Existing employee data populates the form.",
                "Successful edit updates the list.",
                "Failure remains recoverable.",
            ],
            s,
        )
    )
    story.append(Paragraph("Deactivation", s["h3"]))
    story.append(
        bullets(
            [
                "Confirmation is required.",
                "Cancel performs no mutation.",
                "Confirm deactivates the employee.",
                "Failure does not show a false inactive status.",
                "Retry succeeds.",
            ],
            s,
        )
    )
    story.append(Paragraph("Accessibility-oriented tests", s["h3"]))
    story.append(
        bullets(
            [
                "Controls are queryable by roles and accessible names.",
                "Validation messages are associated correctly.",
                "Dialogs have accessible names.",
                "Core workflows are keyboard operable where practical.",
            ],
            s,
        )
    )

    story.append(Paragraph("12. Storybook", s["h1"]))
    story.append(
        Paragraph(
            "Storybook is optional in the assessment, but include it if it can be integrated without destabilizing the application. If included, add stories for reusable components and major states: employee table populated, employee cards populated, loading, empty dataset, no filtered results, fetch error, employee form create mode, employee form edit mode, validation errors, deactivation confirmation, status badges, and API operation loading.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "If Storybook is not included, document the reason in the final report.",
            s["body"],
        )
    )

    story.append(Paragraph("13. README.md requirements", s["h1"]))
    story.append(
        Paragraph(
            "Create or update README.md with:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Project overview.",
                "Implemented features.",
                "Technology choices.",
                "Architecture summary.",
                "Setup instructions.",
                "Development command.",
                "Test command.",
                "Lint command.",
                "Build command.",
                "Storybook command if included.",
                "Mock API explanation.",
                "Demo-state instructions.",
                "Deployment instructions.",
                "Accessibility notes.",
                "Known tradeoffs.",
                "The required Senior Touch sections in Section 15.",
            ],
            s,
        )
    )

    story.append(Paragraph("14. PROMPTS.md / AI usage requirement", s["h1"]))
    story.append(
        Paragraph(
            "Create PROMPTS.md for the required AI usage disclosure. Include:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "The master implementation prompt.",
                "Any major follow-up prompts used during implementation.",
                "Short explanation of how AI output was reviewed.",
                "Statement that generated code was validated through type checking, linting, tests, builds, and manual review.",
                "No credentials, secrets, employee personal data, or private repository information.",
            ],
            s,
        )
    )

    story.append(Paragraph("15. Senior Touch requirements", s["h1"]))
    story.append(
        Paragraph(
            "README.md must include the following Senior Touch sections.",
            s["body"],
        )
    )
    story.append(Paragraph("15.1 If the employee API is unavailable", s["h2"]))
    story.append(
        Paragraph(
            "Explain a senior-level approach:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Keep last successful cached data visible where safe.",
                "Show a stale/offline indicator.",
                "Use bounded retry with backoff for transient read failures.",
                "Provide explicit manual retry.",
                "Avoid infinite retries.",
                "Preserve unsaved form data.",
                "Do not show false success for writes.",
                "Add idempotency keys for real write APIs.",
                "Queue offline writes only if product rules and conflict resolution are defined.",
                "Add observability for failures and latency.",
                "Separate network, authorization, validation, conflict, and server errors.",
                "Use timeouts and request cancellation.",
                "Define recovery behavior with product and backend teams.",
            ],
            s,
        )
    )
    story.append(Paragraph("15.2 If the company has 100,000+ employees", s["h2"]))
    story.append(
        Paragraph(
            "Explain:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Server-side filtering and pagination.",
                "Indexed backend search.",
                "Debounced queries.",
                "Request cancellation.",
                "Cursor/keyset pagination where suitable.",
                "Stable sorting.",
                "Query caching.",
                "Small page sizes.",
                "Avoid downloading the full dataset.",
                "URL-backed filters.",
                "Table virtualization only when rendering large client-side windows.",
                "Backend-generated department/status facets.",
                "Rate limiting.",
                "Search observability.",
                "Export as an asynchronous server job.",
                "Access control and audit logging.",
                "Optimistic updates only with reliable rollback.",
                "Performance budgets and production monitoring.",
            ],
            s,
        )
    )

    story.append(Paragraph("16. Deployment and validation", s["h1"]))
    story.append(Paragraph("16.1 Deployment preparation", s["h2"]))
    story.append(
        Paragraph(
            "See Section 2.1. The production build must succeed. The mock API and demo-state controls must work in the deployed assessment. No secret may be committed.",
            s["body"],
        )
    )
    story.append(Paragraph("16.2 Validation commands", s["h2"]))
    story.append(
        Paragraph(
            "Run the repository's real commands. At minimum validate dependency installation, type checking, lint, automated tests, production build, and Storybook build if Storybook is included.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "Typical commands may include: npm install; npm run typecheck; npm run lint; npm run test -- --run; npm run build; npm run build-storybook.",
            s["body"],
        )
    )
    story.append(
        Paragraph(
            "Use the package manager already selected by the repository. Do not create competing lock files. Fix failures caused by this implementation. Report unrelated pre-existing failures separately.",
            s["body"],
        )
    )

    story.append(Paragraph("17. Manual QA and definition of done", s["h1"]))
    story.append(Paragraph("17.1 Final manual QA", s["h2"]))
    story.append(
        Paragraph(
            "Verify the following:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "Search by first name, last name, and case-insensitive search.",
                "Department filtering, status filtering, and combined search and filters.",
                "Clearing filters.",
                "Pagination and page reset after filter changes.",
                "URL state after refresh.",
                "Add employee, edit employee, view details.",
                "Deactivate confirmation, cancel deactivation, deactivation failure and retry.",
                "Loading state, empty dataset, no-match state.",
                "Fetch error and retry.",
                "Create/edit loading, create/edit failure and retry.",
                "Desktop layout and mobile layout.",
                "Keyboard navigation, focus behavior, and screen-reader names.",
                "Validation communication.",
                "Production build.",
            ],
            s,
        )
    )

    story.append(Paragraph("17.2 Definition of done", s["h2"]))
    story.append(
        Paragraph(
            "The task is complete only when:",
            s["body"],
        )
    )
    story.append(
        bullets(
            [
                "React and TypeScript are used.",
                "All required employee fields are displayed.",
                "Search by employee name works.",
                "Department filtering works.",
                "Employment-status filtering works.",
                "Pagination works.",
                "The same validated form supports create and edit.",
                "View details works.",
                "Deactivation requires confirmation.",
                "Loading, empty, no-match, fetch-error, and mutation-error states are implemented.",
                "Every API failure has a clear recovery path.",
                "Desktop and mobile layouts work.",
                "Accessibility requirements are addressed.",
                "Meaningful automated tests pass.",
                "README includes API-unavailable and 100,000+ employee strategies.",
                "PROMPTS.md documents AI usage.",
                "Production build passes.",
                "Deployment configuration is ready.",
                "No secret or real employee data is included.",
                "No false success state is shown after an API failure.",
            ],
            s,
        )
    )

    story.append(Paragraph("18. Final delivery report", s["h1"]))
    story.append(
        Paragraph(
            "After completing the implementation, report:",
            s["body"],
        )
    )
    numbered = [
        "Architecture used.",
        "Libraries added and why.",
        "Main features completed.",
        "Responsive behavior.",
        "Accessibility work.",
        "Mock API design.",
        "Error and recovery behavior.",
        "Automated tests added.",
        "Storybook status.",
        "Files created or modified.",
        "Commands executed.",
        "Type-check, lint, test, and build results.",
        "Deployment URL or exact deployment steps.",
        "Known limitations.",
        "Potential production improvements.",
    ]
    story.append(
        ListFlowable(
            [
                ListItem(Paragraph(item, s["bullet"]), leftIndent=12, bulletColor=TEAL)
                for item in numbered
            ],
            bulletType="1",
            start="1",
            leftIndent=18,
            spaceAfter=10,
        )
    )

    story.append(Spacer(1, 0.2 * inch))
    story.append(
        callout(
            "<b>End of requirements pack.</b> This document contains only the original technical assessment, reorganized as a client-ready deliverable brief. No additional product rules have been introduced.",
            s,
        )
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title="Employee Management Technical Assessment — Client Deliverables and Requirements",
        author="Technical Assessment Pack",
        subject="Compiled client deliverables from the original Employee Management technical task",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()
