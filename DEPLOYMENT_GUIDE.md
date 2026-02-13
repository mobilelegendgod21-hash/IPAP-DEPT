# Deployment & Management Guide

This guide explains how to make your IPAP DEPT. application public on the internet and how to manage it day-to-day.

## 1. Publishing Your Store (Deployment)

We recommend using **Vercel** or **Netlify** to host your store. Both platforms are free for personal projects and extremely easy to use with React/Vite apps.

### Step 1: Upload to GitHub (If you haven't already)
1.  Initialize Git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Initial commit"`
4.  Create a new repository on GitHub.
5.  Link and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

### Step 2: Deploy to Vercel (Recommended)
1.  Go to [Vercel.com](https://vercel.com) and sign up/log in with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **CRITICAL STEP (Environment Variables):**
    *   Find the "Environment Variables" section in the setup screen.
    *   Add the following variables (copy values from your `.env.local` file):
        *   **Name:** `VITE_SUPABASE_URL`
            **Value:** `https://your-project-id.supabase.co`
        *   **Name:** `VITE_SUPABASE_ANON_KEY`
            **Value:** `your-long-anon-key-string`
5.  Click **"Deploy"**.

Your site will be live within a minute! (e.g., `https://ipap-dept.vercel.app`)

---

## 2. Managing Your Store (Day-to-Day)

Once live, you manage everything through two main interfaces.

### A. The Admin Dashboard (Your Command Center)
This is the hidden dashboard built into your website for daily tasks.

*   **How to Access:**
    Go to your live website URL and add `?secret=admin` to the end.
    *   Example: `https://your-site.vercel.app/?secret=admin`
    *   **Bookmark this link!**

*   **What You Can Do Here:**
    *   **Add Products:** Create new listings, upload images.
    *   **Manage Inventory:** Update stock levels (S, M, L, etc.).
    *   **View Orders:** See customer orders (if implemented in future updates) or use it to check product listings.

### B. The Supabase Dashboard (Backend Management)
This is for technical management and direct database access.

*   **URL:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
*   **What You Can Do Here:**
    *   **Authentication:** Manage user accounts (Admins vs Customers).
    *   **Database:** View raw data tables if needed.
    *   **Storage:** Manage uploaded product images directly.

---

## 3. Important Security Notes

*   **Never share your `?secret=admin` link publicly.**
*   **Only give Admin access to trusted staff.** You can do this by setting `is_admin = TRUE` in the `profiles` table on Supabase for their user account.
*   **Keep your Supabase Key secret.** The `anon` key is safe to be public (it's in the browser), but never share your `service_role` key.
