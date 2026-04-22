<div align="center">
    <h1>Aoun (عون)</h1>
    <h2><strong>Advanced Alzheimer's Caregiver Support Platform</strong></h2>
</div>

<hr />

<h2>Project Overview</h2>
<p>
    Aoun is a comprehensive, bilingual (Arabic/English) web application designed specifically to empower and assist Alzheimer's caregivers. Recognizing the immense psychological and organizational toll of caregiving, this platform bridges the gap between clinical medical data and day-to-day home care management. 
</p>
<p>
    Delivered entirely as a <strong>solo freelance project</strong>, Aoun demonstrates end-to-end full-stack development, encompassing responsive UI/UX architecture, complex data-driven medical logic, and secure backend integration. The project architecture was rigorously developed to ensure high performance, accessibility, and absolute medical accuracy based on verified pharmacological research.
</p>

<h2>Core Features & Modules</h2>

<h3>1. Caregiver Dashboard & Smart Calendar</h3>
<ul>
    <li><strong>Next-Dose Tracker:</strong> Real-time countdown engine for precise medication administration.</li>
    <li><strong>Interactive Calendar:</strong> A color-coded, visual scheduling system mapping out daily routines, medication adherence, and behavioral logs.</li>
    <li><strong>Daily Progress Log:</strong> A tracking system allowing caregivers to document symptoms like confusion or appetite loss, generating actionable reports for physicians.</li>
</ul>

<h3>2. Medication Hub & Interaction Checker</h3>
<ul>
    <li><strong>Algorithmic Interaction Checking:</strong> A core technical feature that cross-references standard Alzheimer's medications (e.g., Donepezil, Memantine) against secondary drugs to flag potential contraindications.</li>
    <li><strong>Food & Drug Safety:</strong> Integrated logic to warn users about specific food interactions and optimal administration times.</li>
</ul>

<h3>3. Behavioral First Aid (Emergency Protocols)</h3>
<ul>
    <li><strong>Wandering Management:</strong> Step-by-step actionable protocols for sudden disorientation or wandering incidents.</li>
    <li><strong>Agitation & Sundowning:</strong> Non-pharmacological de-escalation techniques tailored for immediate behavioral interventions.</li>
</ul>

<h3>4. Cognitive Activation Lab</h3>
<ul>
    <li><strong>Guided Activities:</strong> Carefully structured exercises, including reminiscence therapy and sensory stimulation, designed to be performed jointly by the caregiver and the patient.</li>
</ul>

<h3>5. Notification Engine</h3>
<ul>
    <li><strong>Local & Push Alerts:</strong> Integrated alert system ensuring critical medication doses and doctor appointments are never missed.</li>
</ul>

<h2>Technical Architecture & Stack</h2>
<p>
    The application relies on a modern, performance-optimized technology stack:
</p>
<ul>
    <li><strong>Frontend Framework:</strong> React.js bootstrapped with Vite for rapid compilation and optimized build sizes.</li>
    <li><strong>State Management & Routing:</strong> React Router for seamless single-page application navigation.</li>
    <li><strong>UI/UX Design:</strong> Vanilla CSS utilizing Glassmorphism design principles, coupled with Framer Motion for fluid, hardware-accelerated state transitions.</li>
    <li><strong>Backend & Authentication:</strong> Firebase Authentication for secure user onboarding and Firestore for real-time patient data and medication logging.</li>
    <li><strong>Localization:</strong> i18next for dynamic, real-time switching between Right-to-Left (Arabic) and Left-to-Right (English) layouts.</li>
</ul>

<h2>Development Context & Freelance Execution</h2>
<p>
    As a solo freelance developer handling this project from concept to deployment, key responsibilities and engineering milestones included:
</p>
<ul>
    <li><strong>Architecture Design:</strong> Designing a scalable component tree capable of handling complex state (medication schedules, language switching, auth state) without performance bottlenecks.</li>
    <li><strong>Data Integration:</strong> Structuring complex medical data from research papers into queryable JSON formats for the Interaction Checker.</li>
    <li><strong>Responsive Engineering:</strong> Guaranteeing a mobile-first approach, recognizing that caregivers primarily access tools on-the-go via smartphones.</li>
</ul>

<h2>Installation & Setup</h2>
<p>To run this project locally for development or review:</p>
<pre><code>
# Clone the repository
git clone [repository_url]

# Navigate into the project directory
cd aoun-caregiver-platform

# Install dependencies
npm install

# Configure environment variables
# Create a .env file in the root directory and add your Firebase credentials:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

# Start the development server
npm run dev
</code></pre>

<hr />
<p><em>Engineered with precision to support those who support others.</em></p>
