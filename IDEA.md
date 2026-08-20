# LazenQuiz - Frontend & Interactive UI

A sleek, responsive, and engaging quiz interface built with Next.js (App Router), Tailwind CSS, TypeScript, and Lucide React.

## Scope of Work (Frontend Only):
1. **Interactive UI Views:**
   - **Quiz Generator View:** Form input topik, difficulty selector (Pills: Easy, Medium, Hard), question count slider, dan start button dengan loading skeleton.
   - **Quiz Play View:** Smooth question card transition, multi-choice cards (A/B/C/D) dengan hotkey interaksi, live timer, and progress bar.
   - **Result & Review View:** Score gauge/summary card, per-question analysis (correct vs chosen option), dan bookmark button.
   - **Saved / History View:** Tampilan riwayat kuis lokal dari LocalStorage.

2. **Client-Side State & Mocking:**
   - Gunakan **LocalStorage** hooks untuk mengelola state kuis aktif, autosave pengerjaan, dan riwayat skor.
   - Gunakan mock data JSON terlebih dahulu untuk simulasi render soal sebelum API backend diintegrasikan.

3. **Backend Integration Readiness:**
   - Pisahkan API call placeholder ke dalam `/lib/api.ts` atau `/services/quiz.ts` dengan interface TypeScript yang jelas agar siap dihubungkan ke Gemini API dan Neon PostgreSQL nanti.
