/**
 * data.js — single source of truth for portfolio content. V2 (index.html/v2.js)
 * renders everything from it; V1 (v1.html) only imports the typing phrases.
 * @module data
 */

/** Hero typing phrases — imported by both V1 (v1.js) and V2 (v2.js). */
export const typingPhrases = {
    en: [
        'Full-Stack Web Developer.',
        'Backend Architecture Expert.',
        'Database & CI/CD Specialist.',
    ],
    vi: [
        'Lập trình viên Full-Stack.',
        'Chuyên gia Kiến trúc Backend.',
        'Tối ưu Cơ sở Dữ liệu & CI/CD.',
    ],
};

export const nav = [
    { href: '#about', label: { en: 'About', vi: 'Giới thiệu' } },
    { href: '#skills', label: { en: 'Skills', vi: 'Kỹ năng' } },
    { href: '#projects', label: { en: 'Projects', vi: 'Dự án' } },
    { href: '#experience', label: { en: 'Experience', vi: 'Kinh nghiệm' } },
    { href: '#contact', label: { en: "Let's Connect", vi: 'Liên hệ' } },
];

export const hero = {
    greeting: { en: "Hi, I'm", vi: 'Xin chào, Tôi là' },
    subtitlePrefix: { en: 'I am a', vi: 'Tôi là' },
    ctaPrimary: { en: 'Explore My Work', vi: 'Khám phá dự án', href: '#projects' },
    ctaSecondary: { en: 'Get In Touch', vi: 'Liên hệ ngay', href: '#contact' },
};

export const about = {
    heading: {
        en: 'Delivering scalable backend structures & responsive frontend experiences',
        vi: 'Xây dựng cấu trúc backend mở rộng & giao diện frontend tối ưu trải nghiệm',
    },
    paragraphs: [
        {
            en: 'As a dedicated Middle Full-stack Developer with 3+ years of hands-on experience, I build robust full-stack software products that solve real business problems. With strong software engineering foundations from Hanoi University of Mining and Geology, my architectural approach prioritizes data efficiency, code maintainability, and clean UI/UX translation.',
            vi: 'Là một lập trình viên Full-stack Middle nhiệt huyết với hơn 3 năm kinh nghiệm thực chiến, tôi chuyên kiến tạo các sản phẩm phần mềm ổn định giúp giải quyết bài toán kinh doanh. Nhờ nền tảng kỹ thuật phần mềm vững chắc từ Đại học Mỏ - Địa chất Hà Nội, tôi luôn ưu tiên hiệu năng dữ liệu, mã nguồn dễ bảo trì và trải nghiệm UI/UX mượt mà.',
        },
        {
            en: 'I actively incorporate AI-assisted development tools (Claude Code, Cursor, Antigravity, Codex) into my workflow to accelerate delivery speeds, perform deep code reviews, and guarantee continuous quality optimization. My goal is to build long-term value, aiming for Senior Full-Stack engineering leadership.',
            vi: 'Tôi chủ động ứng dụng các công cụ phát triển hỗ trợ bởi AI (Claude Code, Cursor, Antigravity, Codex) vào quy trình làm việc nhằm đẩy nhanh tốc độ bàn giao, kiểm duyệt code chuyên sâu và đảm bảo chất lượng liên tục. Mục tiêu của tôi là kiến tạo giá trị dài hạn, định hướng trở thành Senior Full-Stack Developer.',
        },
    ],
    strengths: [
        { icon: 'ph-lightning', en: 'RESTful APIs', vi: 'RESTful APIs' },
        { icon: 'ph-database', en: 'Relational Databases', vi: 'Cơ sở dữ liệu quan hệ' },
        { icon: 'ph-device-mobile', en: 'Figma to UI Fidelity', vi: 'Chuyển đổi Figma chuẩn' },
        { icon: 'ph-brain', en: 'AI-Assisted Efficiency', vi: 'Hiệu suất tối ưu bằng AI' },
        { icon: 'ph-arrows-clockwise', en: 'CI/CD Pipelines & Automation', vi: 'Quy trình CI/CD tự động' },
        { icon: 'ph-trend-up', en: 'Continuous Growth to Senior', vi: 'Định hướng Senior dài hạn' },
    ],
};

export const skillFilters = [
    { key: 'all', label: { en: 'All Tech', vi: 'Tất cả' } },
    { key: 'languages', label: { en: 'Languages', vi: 'Ngôn ngữ' } },
    { key: 'frameworks', label: { en: 'Frameworks & Platforms', vi: 'Framework & Nền tảng' } },
    { key: 'databases', label: { en: 'Databases & UI', vi: 'Cơ sở dữ liệu & UI' } },
    { key: 'devops', label: { en: 'DevOps & AI', vi: 'DevOps & AI' } },
];

export const skills = [
    { id: 'html', category: 'languages', color: 'html', name: 'HTML5', iconSlug: 'html5', iconColor: 'E34F26',
        desc: { en: 'Semantic layouts and search engine optimization.', vi: 'Cấu trúc mã chuẩn ngữ nghĩa và tối ưu hóa SEO.' } },
    { id: 'css', category: 'languages', color: 'css', name: 'CSS3 / SCSS', iconSlug: 'css', iconColor: '1572B6',
        desc: { en: 'Responsive grids, SCSS mapping, structural layouts.', vi: 'Giao diện responsive linh hoạt, phân tách biến SCSS.' } },
    { id: 'js', category: 'languages', color: 'js', name: 'JavaScript', iconSlug: 'javascript', iconColor: 'F7DF1E',
        desc: { en: 'ES6+ syntax, asynchronous event flows, DOM handling.', vi: 'Cú pháp ES6+, xử lý bất đồng bộ, thao tác DOM tối ưu.' } },
    { id: 'ts', category: 'languages', color: 'ts', name: 'TypeScript', iconSlug: 'typescript', iconColor: '3178C6',
        desc: { en: 'Type-safe development, modular component architectures.', vi: 'Lập trình an toàn kiểu dữ liệu, module hóa cấu trúc giao diện.' } },
    { id: 'php', category: 'languages', color: 'php', name: 'PHP', iconSlug: 'php', iconColor: '777BB4',
        desc: { en: 'Full-stack web scripting, OOP patterns, secure session handling.', vi: 'Kịch bản backend hướng đối tượng, xử lý bảo mật phiên làm việc.' } },
    { id: 'python', category: 'languages', color: 'python', name: 'Python', iconSlug: 'python', iconColor: '3776AB',
        desc: { en: 'Fast scripting, API automation, data mapping utilities.', vi: 'Viết kịch bản xử lý nhanh, tự động hóa API, tiện ích dữ liệu.' } },
    { id: 'laravel', category: 'frameworks', color: 'laravel', wide: true, name: 'Laravel', iconSlug: 'laravel', iconColor: 'FF2D20',
        desc: { en: 'Eloquent ORM, complex relational migrations, secure API gateways.', vi: 'Eloquent ORM, di chuyển dữ liệu quan hệ, cổng API bảo mật.' } },
    { id: 'fastapi', category: 'frameworks', color: 'fastapi', name: 'FastAPI', iconSlug: 'fastapi', iconColor: '009688',
        desc: { en: 'Modern async Python services, automatic schema definitions.', vi: 'Kiến trúc backend Python bất đồng bộ, tự động định nghĩa schema.' } },
    { id: 'vue', category: 'frameworks', color: 'vue', wide: true, name: 'VueJS', iconSlug: 'vuedotjs', iconColor: '4FC08D',
        desc: { en: 'Reactive dashboards, modular components, Pinia/Vuex management.', vi: 'Bảng điều khiển phản hồi, module hóa UI, quản lý Pinia/Vuex.' } },
    { id: 'react', category: 'frameworks', color: 'react', name: 'ReactJS', iconSlug: 'react', iconColor: '61DAFB',
        desc: { en: 'Dynamic interactive SPAs, virtual DOM optimization, state hooks.', vi: 'Ứng dụng SPA động tương tác cao, tối ưu DOM ảo, quản lý hook state.' } },
    { id: 'wordpress', category: 'frameworks', color: 'wordpress', name: 'WordPress', iconSlug: 'wordpress', iconColor: '21759B',
        desc: { en: 'Custom theme & plugin engineering, payment gateway hooks.', vi: 'Xây dựng giao diện & plugin tùy biến, cấu hình cổng thanh toán.' } },
    { id: 'mysql', category: 'databases', color: 'mysql', name: 'MySQL', iconSlug: 'mysql', iconColor: '4479A1',
        desc: { en: 'Relational mapping, transactional queries, performance optimization.', vi: 'Ánh xạ quan hệ, tối ưu hóa truy vấn SQL, đảm bảo giao dịch ổn định.' } },
    { id: 'postgres', category: 'databases', color: 'postgres', name: 'PostgreSQL', iconSlug: 'postgresql', iconColor: '336791',
        desc: { en: 'Complex data structures, custom CTE queries, database indexing.', vi: 'Cấu trúc dữ liệu phức tạp, tối ưu chỉ mục, viết truy vấn CTE.' } },
    { id: 'ui-libs', category: 'databases', color: 'react', name: 'UI Libraries', iconSlug: 'tailwindcss', iconColor: '06B6D4',
        desc: { en: 'TailwindCSS, Ant Design, Bootstrap for pixel-perfect fidelity.', vi: 'TailwindCSS, Ant Design, Bootstrap cho giao diện chuẩn Figma.' } },
    { id: 'git', category: 'devops', color: 'git', name: 'Git', iconSlug: 'git', iconColor: 'F05032',
        desc: { en: 'Branching strategies, conflict resolutions, collaborative reviews.', vi: 'Chiến lược phân nhánh, giải quyết xung đột mã nguồn, review code.' } },
    { id: 'devops-tools', category: 'devops', color: 'cicd', name: 'DevOps & Tools', phosphorIcon: 'ph-toolbox',
        desc: { en: 'Git, CI/CD, Docker basic, Postman, PgAdmin4, MySQL Workbench.', vi: 'Sử dụng Git, CI/CD, Docker cơ bản, Postman, PgAdmin4, MySQL Workbench.' } },
    { id: 'ai-productivity', category: 'devops', color: 'postman', name: 'AI Productivity', phosphorIcon: 'ph-brain',
        desc: { en: 'Claude Code, Cursor, Antigravity, Codex, ChatGPT for extreme velocity.', vi: 'Ứng dụng Claude Code, Cursor, Antigravity, Codex, ChatGPT tăng tốc độ lập trình.' } },
];

export const projects = [
    {
        id: 'matsuo',
        name: 'Matsuo System',
        tag: { en: 'Backend Heavy / API Integration', vi: 'Backend / Tích hợp API' },
        techIcons: [
            { name: 'Laravel', slug: 'laravel', color: 'FF2D20' },
            { name: 'VueJS', slug: 'vuedotjs', color: '4FC08D' },
            { name: 'PostgreSQL', slug: 'postgresql', color: '336791' },
        ],
        mockIcon: 'ph-receipt',
        subtitle: { en: '4 members | March 2026 - May 2026', vi: '4 thành viên | Tháng 3/2026 - Tháng 5/2026' },
        desc: {
            en: 'A web-based system designed to process and manage multiple types of CSV files, where each file type follows its own processing rules. The extracted data is used to generate and manage information for partners, departments, and invoices.',
            vi: 'Hệ thống nền tảng web được thiết kế để xử lý và quản lý nhiều loại tệp CSV, trong đó mỗi loại tệp tuân theo các quy tắc xử lý riêng biệt. Dữ liệu trích xuất được sử dụng để tạo và quản lý thông tin cho đối tác, phòng ban và hóa đơn.',
        },
        highlights: [
            { en: 'Built the frontend interface and backend APIs based on project requirements.', vi: 'Xây dựng giao diện frontend và hệ thống API backend dựa trên yêu cầu dự án.' },
            { en: 'Designed and implemented CSV file upload, creation, and update features based on different file types with specific processing rules.', vi: 'Thiết kế và triển khai tính năng tải lên, tạo mới và cập nhật tệp CSV cho từng loại tệp với quy tắc xử lý cụ thể.' },
            { en: 'Implemented data processing logic to transform CSV data into partner, department, and invoice information.', vi: 'Triển khai logic xử lý dữ liệu để chuyển đổi dữ liệu CSV thành thông tin đối tác, phòng ban và hóa đơn.' },
            { en: 'Integrated the system with Money Forward for invoice creation and management.', vi: 'Tích hợp hệ thống với dịch vụ Money Forward để tạo và quản lý hóa đơn.' },
            { en: 'Developed and optimized RESTful APIs for frontend consumption.', vi: 'Phát triển và tối ưu hóa hệ thống RESTful API phục vụ phía frontend.' },
            { en: 'Ensured system performance and stability when handling multiple files and large datasets.', vi: 'Đảm bảo hiệu năng và độ ổn định của hệ thống khi xử lý nhiều tệp tin và tập dữ liệu lớn.' },
        ],
        techTags: ['Laravel', 'VueJS', 'PostgreSQL', 'Money Forward Service'],
        featured: true,
    },
    {
        id: 'crm',
        name: 'Simple CRM',
        tag: { en: 'Full-Stack / FastAPI', vi: 'Full-Stack / FastAPI' },
        techIcons: [
            { name: 'FastAPI', slug: 'fastapi', color: '009688' },
            { name: 'VueJS', slug: 'vuedotjs', color: '4FC08D' },
            { name: 'MySQL', slug: 'mysql', color: '4479A1' },
        ],
        mockIcon: 'ph-chat-circle-text',
        subtitle: { en: '3 members | March 2026 - May 2026', vi: '3 thành viên | Tháng 3/2026 - Tháng 5/2026' },
        desc: {
            en: "Developed a contact management website used as a contact portal for the client's main website, allowing users to submit inquiries and administrators to manage incoming messages efficiently.",
            vi: 'Xây dựng website quản lý liên hệ (contact portal) cho trang chủ của khách hàng, cho phép người dùng gửi yêu cầu và quản trị viên xử lý tin nhắn đến một cách hiệu quả.',
        },
        highlights: [
            { en: 'Developed contact form modules for customer websites.', vi: 'Phát triển module biểu mẫu liên hệ (contact form) cho website khách hàng.' },
            { en: 'Built responsive UI/UX for contact forms and admin dashboard.', vi: 'Xây dựng giao diện responsive cho biểu mẫu liên hệ và bảng điều khiển quản trị.' },
            { en: 'Designed and implemented RESTful APIs using FastAPI.', vi: 'Thiết kế và triển khai RESTful API bằng FastAPI.' },
            { en: 'Implemented message management functions including search, filtering, and status handling.', vi: 'Triển khai chức năng quản lý tin nhắn bao gồm tìm kiếm, lọc và xử lý trạng thái.' },
            { en: 'Participated in code reviews to maintain code quality.', vi: 'Tham gia đánh giá mã nguồn (code review) để duy trì chất lượng code.' },
        ],
        techTags: ['FastAPI', 'VueJS', 'MySQL', 'Ant Design'],
        featured: false,
    },
    {
        id: 'fany-story',
        name: 'Fany Story',
        tag: { en: 'Full-Stack / Microservices', vi: 'Full-Stack / NestJS / PDF.js' },
        techIcons: [
            { name: 'VueJS', slug: 'vuedotjs', color: '4FC08D' },
            { name: 'Laravel', slug: 'laravel', color: 'FF2D20' },
            { name: 'NestJS', slug: 'nestjs', color: 'E0234E' },
        ],
        mockIcon: 'ph-book-open-text',
        subtitle: { en: '5 members | November 2024 - February 2025', vi: '5 thành viên | Tháng 11/2024 - Tháng 2/2025' },
        desc: {
            en: 'A story-reading web app with a separate web-based admin portal for content management, including author registration and story uploads.',
            vi: 'Ứng dụng web đọc truyện với cổng quản trị riêng biệt để quản lý nội dung, bao gồm đăng ký tác giả và đăng tải chương truyện.',
        },
        highlights: [
            { en: 'Built core features: users, manga, reader, chapters, master data and uploads.', vi: 'Xây dựng các tính năng cốt lõi: quản lý người dùng, truyện tranh (manga), giao diện đọc, chương truyện, dữ liệu danh mục (master data) và tải lên tệp tin.' },
            { en: 'Converted Figma designs into responsive, accessible UIs with pixel-perfect fidelity.', vi: 'Chuyển đổi bản thiết kế Figma thành giao diện responsive dễ tiếp cận với độ chính xác cao.' },
            { en: 'Used PDF.js to render admin-uploaded registration PDFs for end users.', vi: 'Sử dụng thư viện PDF.js để hiển thị trực quan tài liệu hướng dẫn tác giả đăng ký (PDF) cho người dùng cuối.' },
            { en: 'Participated in code reviews to maintain code quality.', vi: 'Tham gia đánh giá mã nguồn (code review) để duy trì chất lượng code.' },
        ],
        techTags: ['VueJS', 'TailwindCSS', 'PDF.js', 'Ant Design', 'Laravel', 'NestJs', 'MySQL'],
        featured: false,
    },
    {
        id: 'cleaning-shift',
        name: 'Cleaning Shift',
        tag: { en: 'Full-Stack / Booking System', vi: 'Full-Stack / Hệ thống đặt chỗ' },
        techIcons: [
            { name: 'Laravel', slug: 'laravel', color: 'FF2D20' },
            { name: 'ReactJS', slug: 'react', color: '61DAFB' },
            { name: 'MySQL', slug: 'mysql', color: '4479A1' },
        ],
        mockIcon: 'ph-calendar-check',
        subtitle: { en: '4 members | February 2024 - May 2024', vi: '4 thành viên | Tháng 2/2024 - Tháng 5/2024' },
        desc: {
            en: 'A web-based system for managing campsite bookings, including staff and customer management, reservation scheduling, payments, and reporting features.',
            vi: 'Hệ thống web quản lý đặt chỗ khu cắm trại (campsite), bao gồm quản lý nhân viên, khách hàng, lịch đặt chỗ, thanh toán và báo cáo.',
        },
        highlights: [
            { en: 'Developed RESTful APIs and responsive UI based on technical specifications and Figma designs.', vi: 'Phát triển RESTful API và giao diện responsive dựa trên tài liệu kỹ thuật và thiết kế Figma.' },
            { en: 'Implemented JWT-based authentication and authorization, ensuring secure user access and role-based permissions.', vi: 'Triển khai xác thực và phân quyền dựa trên JWT, đảm bảo truy cập an toàn và phân quyền theo vai trò.' },
            { en: 'Developed customer management and campsite booking modules.', vi: 'Phát triển module quản lý khách hàng và đặt chỗ khu cắm trại.' },
            { en: 'Implemented online payment integration using Stripe.', vi: 'Tích hợp thanh toán trực tuyến qua Stripe.' },
            { en: 'Developed admin dashboard for managing users and marketplace data.', vi: 'Xây dựng bảng điều khiển quản trị để quản lý người dùng và dữ liệu marketplace.' },
            { en: 'Participated in code reviews to maintain code quality.', vi: 'Tham gia đánh giá mã nguồn để duy trì chất lượng code.' },
        ],
        techTags: ['Laravel', 'ReactJS', 'Ant Design', 'MySQL', 'Stripe', 'FullCalendar'],
        featured: false,
    },
];

export const experience = [
    {
        id: 'dt-solutions',
        date: { en: 'June 2023 - May 2026', vi: 'Tháng 6/2023 - Tháng 5/2026' },
        role: { en: 'Full-stack Web Developer', vi: 'Nhà phát triển Web Full-stack' },
        company: 'DT Solutions',
        details: {
            en: [
                'Developed and maintained full-stack web applications using PHP and modern frontend frameworks.',
                'Designed and optimized RESTful APIs with scalable architecture and efficient data flow.',
                'Built responsive, cross-browser compatible UIs based on Figma designs.',
                'Customized WordPress themes and plugins for business and e-commerce needs.',
                'Integrated payment gateways (Stripe, PayJP) for secure transactions.',
                'Performed code reviews, bug fixing, and performance optimization in team collaboration.',
            ],
            vi: [
                'Phát triển và bảo trì các ứng dụng web Full-stack sử dụng PHP và các framework frontend hiện đại.',
                'Thiết kế và tối ưu hóa hệ thống API RESTful với kiến trúc mở rộng và luồng dữ liệu tối ưu.',
                'Xây dựng giao diện responsive tương thích đa trình duyệt từ bản thiết kế Figma chuẩn xác.',
                'Tùy biến các giao diện (theme) và plugin WordPress đáp ứng nhu cầu kinh doanh và thương mại điện tử.',
                'Tích hợp các cổng thanh toán quốc tế (Stripe, PayJP) và xử lý giao dịch bảo mật.',
                'Tham gia đánh giá mã nguồn (code review), sửa lỗi và tối ưu hóa hiệu năng trong nhóm.',
            ],
        },
    },
    {
        id: 'pionero',
        date: { en: 'Mar 2025 - Jan 2026', vi: 'Tháng 3/2025 - Tháng 1/2026' },
        role: { en: 'Onsite PHP Developer', vi: 'Nhà phát triển PHP Onsite' },
        company: 'Pionero Viet Nam',
        details: {
            en: [
                'Maintained and contributed to multiple onsite projects, ranging from legacy PHP systems (PHP 5.x-8.x) to modern Laravel & VueJS applications, as well as WordPress-based websites.',
                'Built and customized WordPress websites, including theme and plugin development, ensuring performance optimization.',
                'Collaborated closely with team members to ensure system stability, code quality, and on-time delivery.',
                'Applied CI/CD pipelines using CircleCI to support build and deployment workflows.',
            ],
            vi: [
                'Bảo trì và đóng góp vào nhiều dự án tại văn phòng khách hàng, từ hệ thống PHP cũ (PHP 5.x-8.x) đến các ứng dụng Laravel & VueJS hiện đại, cũng như các trang web nền tảng WordPress.',
                'Xây dựng và tùy biến website WordPress, bao gồm lập trình giao diện (theme) và plugin, đảm bảo tối ưu hóa hiệu năng.',
                'Hợp tác chặt chẽ với các thành viên trong nhóm để đảm bảo sự ổn định của hệ thống, chất lượng mã nguồn và bàn giao đúng hẹn.',
                'Áp dụng quy trình CI/CD sử dụng CircleCI nhằm hỗ trợ các luồng đóng gói và triển khai.',
            ],
        },
    },
    {
        id: 'humg',
        date: { en: '2019 - 2023', vi: '2019 - 2023' },
        role: { en: 'Bachelor of Software Engineering', vi: 'Kỹ sư Kỹ thuật Phần mềm' },
        company: { en: 'Hanoi University of Mining and Geology', vi: 'Trường Đại học Mỏ - Địa chất Hà Nội' },
        details: {
            en: [
                'Major: Software Engineering',
                'Graduation GPA: 3.14 (Strong Academic Classification)',
                'Acquired solid fundamentals in Object-Oriented Programming (OOP), Data Structures & Algorithms, Database Design, System Analysis, and Software testing methodologies.',
            ],
            vi: [
                'Chuyên ngành: Kỹ thuật Phần mềm',
                'Điểm trung bình tốt nghiệp: 3.14 (Xếp loại Khá)',
                'Trang bị kiến thức nền tảng vững vàng về Lập trình hướng đối tượng (OOP), Cấu trúc dữ liệu & Giải thuật, Thiết kế cơ sở dữ liệu, Phân tích thiết kế hệ thống và Kiểm thử phần mềm.',
            ],
        },
        isEducation: true,
    },
];

export const contact = {
    connectHeading: { en: 'Connect With Me', vi: 'Kết nối với mình' },
    blurb: {
        en: 'Feel free to reach out for project collaboration, job opportunities, or technical inquiries. I am always open to exchanging ideas and growing technical expertise.',
        vi: 'Hãy liên lạc với mình để cùng hợp tác dự án, cơ hội nghề nghiệp hoặc trao đổi kỹ thuật. Mình luôn cởi mở chia sẻ các ý tưởng và phát triển chuyên môn kỹ thuật.',
    },
    items: [
        { icon: 'ph-envelope-simple', label: { en: 'Email', vi: 'Email' }, value: 'tranhungith18@gmail.com', href: 'mailto:tranhungith18@gmail.com' },
        { icon: 'ph-phone', label: { en: 'Phone', vi: 'Điện thoại' }, value: '0964985882', href: 'tel:0964985882' },
        { icon: 'ph-github-logo', label: { en: 'GitHub', vi: 'GitHub' }, value: 'github.com/tranhung18', href: 'https://github.com/tranhung18', external: true },
        { icon: 'ph-facebook-logo', label: { en: 'Facebook', vi: 'Facebook' }, value: 'facebook.com/tranhung18.it', href: 'https://www.facebook.com/tranhung18.it', external: true },
    ],
};

export const footer = {
    en: '© 2026 Trần Hữu Hùng. All rights reserved. Built with clean, high-performance code.',
    vi: '© 2026 Trần Hữu Hùng. Bảo lưu mọi quyền. Xây dựng với mã nguồn sạch, hiệu năng cao.',
};

