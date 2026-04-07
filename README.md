# SYNCRO
SYNCRO is a modern web application (Athlete Monitoring System) designed for sports teams. It enables detailed tracking of training loads, wellness metrics, helping coaches optimize performance and prevent injuries.

# For Coaches (Coach Dashboard)
* **Team Management:** Create teams and generate unique invitation codes for players.
* **Quick KPI Cards:** Instant overview of report completion rates, average training loads, and at-risk players.
* ** Analytics (Charts):**
  * **Weekly Load:** Microcycle visualization (RPE × minutes).
  * **Wellness Radar:** Comparison of the team's current and previous day's condition (sleep, fatigue, soreness, stress, mood).
  * **Trends Over Time:** Tracking the correlation between sleep quality and fatigue.
* **Team Heatmap:** A detailed interactive table featuring a "traffic light" system for quick identification of overloaded players.

# For Players (Player View)
* **Daily Reports:** An intuitive form for submitting RPE and subjective wellness data.

## Technologies
**Frontend:**
* [React](https://reactjs.org/) (Vite)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* [Recharts](https://recharts.org/) (Complex charts and data visualization)
* [Lucide React](https://lucide.dev/) (Icons)
* React Router (Routing)
* Axios (API communication)

**Backend:**
* Node.js & Express (REST API)
* MongoDB & Mongoose (Database)
* JWT (Authentication)
