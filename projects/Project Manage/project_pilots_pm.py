import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from dataclasses import dataclass, field
from datetime import datetime, date
import uuid
import json
import os

DATA_FILE = "project_pilots_data.json"

STATUSES = ["Backlog", "Planned", "In Progress", "Blocked", "Done"]
PRIORITIES = ["Low", "Medium", "High", "Critical"]
MILESTONE_STATUS = ["Pending", "Achieved"]

# ---------------- Dark Theme Palette ----------------
BG_DARK = "#0f0f0f"
BG_SECONDARY = "#1a1a1a"
BG_HOVER = "#2a2a2a"
BG_ACCENT = "#333333"
FG_PRIMARY = "#e8e8e8"
FG_SECONDARY = "#a0a0a0"
BORDER_COLOR = "#2d2d2d"
ACCENT = "#4a9eff"

FONT_FAMILY = "Segoe UI"
FONT_SIZE = 11
FONT_SIZE_HEADER = 18

# ---------------- Models ----------------
@dataclass
class Task:
    id: str
    title: str
    owner: str
    start: str
    due: str
    status: str
    priority: str
    notes: str

@dataclass
class Milestone:
    id: str
    title: str
    due: str
    status: str

@dataclass
class Project:
    id: str
    name: str
    tasks: list[Task] = field(default_factory=list)
    milestones: list[Milestone] = field(default_factory=list)

# ---------------- Helpers ----------------
def today():
    return date.today().isoformat()

def parse_date(d):
    try:
        return datetime.strptime(d, "%Y-%m-%d").date()
    except:
        return None

def overdue(task: Task):
    if task.status == "Done":
        return False
    d = parse_date(task.due)
    return d and d < date.today()

# ---------------- App ----------------
class ProjectPilotsPM(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Project Pilots – Project Management")
        self.geometry("1200x720")
        self.configure(bg=BG_DARK)

        self.projects: list[Project] = []
        self.current: Project | None = None

        self._load()
        self._style()
        self._ui()
        self._refresh_projects()

    # ---------- Styling ----------
    def _style(self):
        style = ttk.Style(self)
        style.theme_use("clam")

        # Base styling
        style.configure(
            ".",
            background=BG_DARK,
            foreground=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE),
        )

        # Frame
        style.configure("TFrame", background=BG_DARK)

        # Label
        style.configure(
            "TLabel",
            background=BG_DARK,
            foreground=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE),
            padding=(4, 4),
        )

        # Header label style
        style.configure(
            "Header.TLabel",
            background=BG_DARK,
            foreground=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE_HEADER, "bold"),
        )

        # Section label style
        style.configure(
            "Section.TLabel",
            background=BG_DARK,
            foreground=FG_SECONDARY,
            font=(FONT_FAMILY, FONT_SIZE, "bold"),
            padding=(4, 8),
        )

        # Button
        style.configure(
            "TButton",
            background=BG_SECONDARY,
            foreground=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE),
            padding=(12, 8),
            borderwidth=0,
            relief="flat",
        )
        style.map(
            "TButton",
            background=[("active", BG_HOVER), ("pressed", BG_ACCENT)],
            foreground=[("active", FG_PRIMARY), ("pressed", FG_PRIMARY)],
        )

        # Notebook
        style.configure(
            "TNotebook",
            background=BG_DARK,
            borderwidth=0,
            tabmargins=(8, 8, 8, 0),
        )
        style.configure(
            "TNotebook.Tab",
            background=BG_SECONDARY,
            foreground=FG_SECONDARY,
            font=(FONT_FAMILY, FONT_SIZE),
            padding=(16, 10),
            borderwidth=0,
        )
        style.map(
            "TNotebook.Tab",
            background=[("selected", BG_ACCENT)],
            foreground=[("selected", FG_PRIMARY)],
            expand=[("selected", (0, 0, 0, 2))],
        )

        # Treeview
        style.configure(
            "Treeview",
            background=BG_SECONDARY,
            foreground=FG_PRIMARY,
            fieldbackground=BG_SECONDARY,
            font=(FONT_FAMILY, FONT_SIZE),
            rowheight=28,
            borderwidth=0,
        )
        style.configure(
            "Treeview.Heading",
            background=BG_ACCENT,
            foreground=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE, "bold"),
            padding=(8, 6),
            borderwidth=0,
        )
        style.map(
            "Treeview",
            background=[("selected", BG_HOVER)],
            foreground=[("selected", FG_PRIMARY)],
        )
        style.map(
            "Treeview.Heading",
            background=[("active", BG_HOVER)],
        )

    # ---------- UI ----------
    def _ui(self):
        header = ttk.Frame(self)
        header.pack(fill="x", padx=16, pady=14)

        ttk.Label(header, text="Project Pilots", style="Header.TLabel").pack(side="left")
        ttk.Button(header, text="New Project", command=self._new_project).pack(side="right")

        body = ttk.Frame(self)
        body.pack(fill="both", expand=True, padx=16, pady=12)

        # Project list
        left = ttk.Frame(body)
        left.pack(side="left", fill="y", padx=(0, 16))

        ttk.Label(left, text="Projects", style="Section.TLabel").pack(anchor="w")
        self.project_list = tk.Listbox(
            left,
            bg=BG_SECONDARY,
            fg=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE),
            width=26,
            selectbackground=ACCENT,
            selectforeground=FG_PRIMARY,
            highlightthickness=0,
            borderwidth=0,
            relief="flat",
            activestyle="none",
        )
        self.project_list.pack(fill="y", expand=True, pady=(4, 0))
        self.project_list.bind("<<ListboxSelect>>", self._select_project)

        # Tabs
        self.tabs = ttk.Notebook(body)
        self.tabs.pack(fill="both", expand=True)

        self.tab_plan = ttk.Frame(self.tabs)
        self.tab_coord = ttk.Frame(self.tabs)
        self.tab_milestones = ttk.Frame(self.tabs)
        self.tab_report = ttk.Frame(self.tabs)

        self.tabs.add(self.tab_plan, text="  Plan  ")
        self.tabs.add(self.tab_coord, text="  Coordinate  ")
        self.tabs.add(self.tab_milestones, text="  Milestones  ")
        self.tabs.add(self.tab_report, text="  Report  ")

        self._plan_ui()
        self._coord_ui()
        self._milestone_ui()
        self._report_ui()

    # ---------- Plan ----------
    def _plan_ui(self):
        top = ttk.Frame(self.tab_plan)
        top.pack(fill="x", pady=12, padx=8)
        ttk.Button(top, text="Add Task", command=self._add_task).pack(side="left")

        tree_frame = ttk.Frame(self.tab_plan)
        tree_frame.pack(fill="both", expand=True, padx=8, pady=(0, 12))

        self.task_tree = ttk.Treeview(
            tree_frame,
            columns=("title", "owner", "due", "status", "priority"),
            show="headings",
        )
        for c in self.task_tree["columns"]:
            self.task_tree.heading(c, text=c.title())
            self.task_tree.column(c, width=140, anchor="w")
        self.task_tree.pack(fill="both", expand=True)

    # ---------- Coordinate ----------
    def _coord_ui(self):
        self.kanban = {}
        row = ttk.Frame(self.tab_coord)
        row.pack(fill="both", expand=True, padx=8, pady=12)

        for i, st in enumerate(STATUSES):
            col = ttk.Frame(row)
            col.grid(row=0, column=i, sticky="nsew", padx=6, pady=4)
            row.grid_columnconfigure(i, weight=1)
            row.grid_rowconfigure(0, weight=1)

            ttk.Label(col, text=st, style="Section.TLabel").pack(anchor="w", pady=(0, 6))
            lb = tk.Listbox(
                col,
                bg=BG_SECONDARY,
                fg=FG_PRIMARY,
                font=(FONT_FAMILY, FONT_SIZE),
                selectbackground=ACCENT,
                selectforeground=FG_PRIMARY,
                highlightthickness=0,
                borderwidth=0,
                relief="flat",
                activestyle="none",
            )
            lb.pack(fill="both", expand=True)
            lb.bind("<Double-1>", lambda e, s=st: self._move_forward(s))
            self.kanban[st] = lb

    # ---------- Milestones ----------
    def _milestone_ui(self):
        top = ttk.Frame(self.tab_milestones)
        top.pack(fill="x", pady=12, padx=8)
        ttk.Button(top, text="Add Milestone", command=self._add_milestone).pack(side="left")

        tree_frame = ttk.Frame(self.tab_milestones)
        tree_frame.pack(fill="both", expand=True, padx=8, pady=(0, 12))

        self.milestone_tree = ttk.Treeview(
            tree_frame,
            columns=("title", "due", "status"),
            show="headings",
        )
        for c in self.milestone_tree["columns"]:
            self.milestone_tree.heading(c, text=c.title())
            self.milestone_tree.column(c, width=180, anchor="w")
        self.milestone_tree.pack(fill="both", expand=True)

    # ---------- Report ----------
    def _report_ui(self):
        report_frame = ttk.Frame(self.tab_report)
        report_frame.pack(fill="both", expand=True, padx=8, pady=12)

        self.report_box = tk.Text(
            report_frame,
            bg=BG_SECONDARY,
            fg=FG_PRIMARY,
            font=(FONT_FAMILY, FONT_SIZE),
            wrap="word",
            insertbackground=FG_PRIMARY,
            highlightthickness=0,
            borderwidth=0,
            relief="flat",
            padx=12,
            pady=12,
        )
        self.report_box.pack(fill="both", expand=True)

        btn_frame = ttk.Frame(self.tab_report)
        btn_frame.pack(fill="x", padx=8, pady=(0, 12))
        ttk.Button(
            btn_frame,
            text="Generate Weekly Report",
            command=self._generate_report,
        ).pack(side="left")

    # ---------- Actions ----------
    def _new_project(self):
        name = simpledialog.askstring("Project Name", "Enter project name")
        if name:
            self.projects.append(Project(str(uuid.uuid4()), name))
            self._save()
            self._refresh_projects()

    def _select_project(self, _):
        sel = self.project_list.curselection()
        if not sel:
            return
        self.current = self.projects[sel[0]]
        self._refresh_all()

    def _add_task(self):
        if not self.current:
            return
        title = simpledialog.askstring("Task", "Task title")
        if not title:
            return
        self.current.tasks.append(
            Task(str(uuid.uuid4()), title, "You", today(), "", "Planned", "Medium", "")
        )
        self._save()
        self._refresh_all()

    def _add_milestone(self):
        if not self.current:
            return
        title = simpledialog.askstring("Milestone", "Milestone title")
        due = simpledialog.askstring("Due Date", "YYYY-MM-DD")
        if title:
            self.current.milestones.append(
                Milestone(str(uuid.uuid4()), title, due, "Pending")
            )
            self._save()
            self._refresh_all()

    def _move_forward(self, status):
        i = STATUSES.index(status)
        if i == len(STATUSES) - 1:
            return
        lb = self.kanban[status]
        if not lb.curselection():
            return
        idx = lb.curselection()[0]
        task_id = lb.get(idx).split("|")[-1].strip()
        for t in self.current.tasks:
            if t.id == task_id:
                t.status = STATUSES[i + 1]
        self._save()
        self._refresh_all()

    def _generate_report(self):
        p = self.current
        if not p:
            return

        done = [t.title for t in p.tasks if t.status == "Done"]
        progress = [t.title for t in p.tasks if t.status == "In Progress"]
        blocked = [t.title for t in p.tasks if t.status == "Blocked"]
        milestones = [m.title for m in p.milestones if m.status == "Pending"]

        report = f"""Weekly Project Report – {p.name}

Completed:
{self._fmt(done)}

In Progress:
{self._fmt(progress)}

Blocked:
{self._fmt(blocked)}

Upcoming Milestones:
{self._fmt(milestones)}

Notes:
• Overall progress under review.
"""

        self.report_box.delete("1.0", "end")
        self.report_box.insert("1.0", report)

    # ---------- Refresh ----------
    def _refresh_projects(self):
        self.project_list.delete(0, tk.END)
        for p in self.projects:
            self.project_list.insert(tk.END, p.name)

    def _refresh_all(self):
        self._refresh_tasks()
        self._refresh_kanban()
        self._refresh_milestones()

    def _refresh_tasks(self):
        self.task_tree.delete(*self.task_tree.get_children())
        for t in self.current.tasks:
            self.task_tree.insert(
                "", "end", values=(t.title, t.owner, t.due, t.status, t.priority)
            )

    def _refresh_kanban(self):
        for lb in self.kanban.values():
            lb.delete(0, tk.END)
        for t in self.current.tasks:
            self.kanban[t.status].insert(
                tk.END, f"{t.title} | {t.id}"
            )

    def _refresh_milestones(self):
        self.milestone_tree.delete(*self.milestone_tree.get_children())
        for m in self.current.milestones:
            self.milestone_tree.insert(
                "", "end", values=(m.title, m.due, m.status)
            )

    # ---------- Persistence ----------
    def _save(self):
        with open(DATA_FILE, "w") as f:
            json.dump(self.projects, f, default=lambda o: o.__dict__, indent=2)

    def _load(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE) as f:
                raw = json.load(f)
                self.projects = [
                    Project(
                        p["id"],
                        p["name"],
                        [Task(**t) for t in p.get("tasks", [])],
                        [Milestone(**m) for m in p.get("milestones", [])],
                    )
                    for p in raw
                ]

    def _fmt(self, items):
        return "\n".join(f"• {i}" for i in items) if items else "• None"

# ---------- Run ----------
if __name__ == "__main__":
    ProjectPilotsPM().mainloop()
