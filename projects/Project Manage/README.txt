# Project Pilots – Project Management System

A lightweight desktop project management system built to practice planning, coordination, milestone tracking, and weekly reporting.

This project focuses on applying project management fundamentals in a practical way, rather than just tracking tasks.

---

## Purpose

The aim of this project is to model how real project work is planned, executed, and reported, without the overhead of large enterprise tools.

It allows you to:
- Organize work into projects
- Plan and track tasks
- Move tasks through clear workflow stages
- Track milestones
- Generate simple weekly status reports for stakeholders

---

## Features

### Projects
- Create and manage multiple projects
- Each project has its own tasks and milestones

### Task Planning
- Task title, owner, dates, priority, and notes
- Status-based workflow:
  - Backlog
  - Planned
  - In Progress
  - Blocked
  - Done

### Coordination
- Kanban-style view grouped by task status
- Move tasks through execution stages
- Clear visibility of work in progress and blockers

### Milestones
- Define important project checkpoints
- Track due dates
- Mark milestones as pending or achieved

### Reporting
- Auto-generated weekly project report
- Includes:
  - Completed work
  - Work in progress
  - Blocked items
  - Upcoming milestones
- Report text can be copied into emails, messages, or documents

### Interface
- Dark, minimal desktop interface
- Designed to stay focused and distraction-free

---

## Tech Stack

- Python 3.9+
- Tkinter (GUI)
- JSON for local data storage

No external dependencies are required.

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-pilots-project-manager.git
   cd project-pilots-project-manager
