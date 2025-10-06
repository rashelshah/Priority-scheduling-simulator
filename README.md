# ⚙️ Priority Scheduling in Operating Systems

## 📘 Overview
This project demonstrates **Priority Scheduling**, one of the fundamental **CPU scheduling algorithms** used in operating systems.  
In Priority Scheduling, each process is assigned a **priority value**, and the CPU is allocated to the process with the **highest priority** (or lowest numeric value depending on the convention).

This project helps visualize and understand how processes are executed based on their priorities and how **waiting time**, **turnaround time**, and **response time** are affected.

---

## 🚀 Features
- 🔢 Input custom process data (Process ID, Burst Time, Priority)
- 📊 Displays Gantt Chart visualization
- ⏱️ Calculates:
  - Waiting Time  
  - Turnaround Time  
  - Average Waiting & Turnaround Times
- 💻 Clean and interactive UI (if web-based implementation)
- 📈 Helps learners understand CPU scheduling concepts easily

---

## 🧠 How It Works
1. User enters process details:
   - Process ID  
   - Burst Time  
   - Priority
2. Algorithm sorts processes by **priority order**
3. CPU executes processes accordingly
4. Results are calculated and displayed:
   - Gantt chart representation  
   - Waiting and Turnaround times  

---

## 🧩 Example
| Process | Burst Time | Priority | Waiting Time | Turnaround Time |
|----------|-------------|-----------|---------------|----------------|
| P1 | 5 | 2 | 0 | 5 |
| P2 | 3 | 1 | 5 | 8 |
| P3 | 8 | 3 | 8 | 16 |

**Average Waiting Time:** 4.33  
**Average Turnaround Time:** 9.66  

---

⭐ *If you found this project helpful, give it a star on GitHub!*