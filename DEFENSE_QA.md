# Capstone Defense — Anticipated Questions & Answers
## Garbage Tracking System · Municipality of Socorro, Surigao del Norte

> Each entry includes the question and answer in **English** and **Visaya (Bisaya)**, plus the reason the panel is likely to raise it.

---

## Question 1 — Why did you choose this system as your capstone project?

> **Why it will be asked:** Panels always open by probing motivation. They want to confirm the problem is real and locally grounded, not just a copied idea. A weak answer here damages credibility for the rest of the defense.

### English

**Q:** Why did you choose to develop a Garbage Tracking System for the Municipality of Socorro?

**A:** We chose this topic because the Municipality of Socorro currently relies on manual, paper-based methods to track garbage collection routes and pickups. Dispatchers have no real-time visibility into whether drivers have completed their stops, and residents have no way to know if their barangay was serviced. This leads to missed pickups going unrecorded, accountability gaps, and inefficiency in the LGU's waste management operations. We developed this system to address a real, documented need in our own community — replacing paper checklists with a digital platform that benefits dispatchers, drivers, administrators, and residents alike.

---

### Bisaya

**P:** Ngano nga kining Garbage Tracking System ang inyong gipili isip capstone project para sa Munisipyo sa Socorro?

**S:** Gipili namo kini tungod kay ang Munisipyo sa Socorro nagsalig pa sa manual ug papel-based nga paagi sa pagsubay sa mga rota ug koleksyon sa basura. Walay real-time nga makita ang mga dispatcher kon nahuman na ba ang mga driver sa ilang mga istasyon, ug ang mga residente wala'y paagi sa paghibalo kon nakuha na ba ang basura sa ilang barangay. Kini nagresulta sa mga napasagdan nga istasyon, kakulang sa accountability, ug inefisyensya sa operasyon sa LGU. Gihimo namo kining sistema aron masulbad ang tinuod ug dokumentadong problema sa atong kaugalingong komunidad — nga giilis ang papel nga checklist pinaagi sa digital nga plataporma nga makabenepisyo sa mga dispatcher, driver, administrator, ug residente.

---

## Question 2 — What problem does your system specifically solve?

> **Why it will be asked:** Panels probe whether researchers truly understand the gap they are filling. They want to hear a concrete before-and-after comparison, not a vague answer about "digitizing processes."

### English

**Q:** What specific problem does your Garbage Tracking System solve that was not solved before?

**A:** Before this system, garbage collection in Socorro had three main problems: first, there was no real-time tracking — dispatchers only found out about missed stops at the end of the day through informal reports; second, there was no documented record of pickups — volumes, notes, and timestamps were not captured consistently; and third, residents had no way to check the collection schedule or status without calling the municipal hall. Our system solves all three: dispatchers can monitor route progress live through the dashboard, every pickup is logged with a timestamp, driver, volume, and notes, and residents can view the public schedule at any time without creating an account. The result is a transparent, accountable, and efficient waste management workflow for the LGU.

---

### Bisaya

**P:** Unsa nga espesipiko nga problema ang gisolbar sa inyong sistema nga wala pa masulbad kaniadto?

**S:** Sa wala pa ang sistema, tulo ka nag-unang problema ang nasinati sa koleksyon sa basura sa Socorro: una, walay real-time nga pagsubay — ang mga dispatcher mahibalo lang sa mga napasagdan nga istasyon sa katapusan sa adlaw pinaagi sa informal nga report; ikaduha, walay dokumentadong rekord sa mga pickup — ang volume, mga nota, ug timestamp wala makuha nga konsistente; ug ikatulo, ang mga residente walay paagi sa pagsusi sa skedyul sa koleksyon o sa kahimtang niini nga dili kinahanglang tumawag sa munisipyo. Gisolbar sa atong sistema kining tulo: ang mga dispatcher makamonitor sa progress sa rota sa live pinaagi sa dashboard, ang matag pickup gi-log nga may timestamp, driver, volume, ug mga nota, ug ang mga residente makatinabangay sa public schedule bisan unsang oras nga dili kinahanglang mag-account. Ang resulta usa ka transparent, accountable, ug episyente nga proseso sa pamamahala sa basura alang sa LGU.

---

## Question 3 — What methodology did you use and why is it appropriate?

> **Why it will be asked:** Methodology is a standard chapter in every capstone. Panels test whether researchers truly understand why they chose RAD and can defend it against alternatives like the waterfall model or agile.

### English

**Q:** What development methodology did you use, and why is it the most appropriate for this project?

**A:** We used the Rapid Application Development, or RAD, methodology. RAD is appropriate for this project for three reasons: first, it allows continuous feedback — we could show working modules to LGU stakeholders early and adjust based on their actual needs rather than assumptions; second, it is iterative — we built features in cycles, meaning we could fix problems quickly without starting over; and third, the project timeline for a capstone requires working software within a semester, and RAD's focus on speed without sacrificing quality suits that constraint. A waterfall model would have been too rigid — if we discovered a design problem late, we could not go back and fix it without delaying the entire project. RAD let us adapt as we learned more about how the LGU actually operates.

---

### Bisaya

**P:** Unsang methodology ang inyong gigamit, ug ngano nga kini ang labing angay para sa proyekto?

**S:** Gigamit namo ang Rapid Application Development, o RAD, nga methodology. Angay ang RAD alang sa proyekto tungod sa tulo ka rason: una, gitugotan kini sa padayon nga feedback — makita namo sa mga stakeholder sa LGU ang nagtrabaho nga mga module sa sayo pa ug maayos kini base sa ilang tinuod nga mga pangangailangan imbis sa mga huna-huna lang; ikaduha, iterative kini — gitukod namo ang mga feature sa mga siklo, nagpasabot nga dali ra namo masulbad ang mga problema nga dili kinahanglang magsugod pag-usab; ug ikatulo, ang timeline sa capstone nagkinahanglan og nagtrabaho nga software sulod sa usa ka semestre, ug ang focus sa RAD sa katulin nga dili gisakripisyo ang kalidad angay sa kong kinahanglan. Ang waterfall model unta hilabihan ka rigid — kung madiskubre namo ang usa ka problema sa disenyo sa ulahi, dili na namo mabalik ug maayo kini nga dili mapalugway ang tibuok proyekto. Gitugotan kami sa RAD nga maka-adapt samtang nahibalo kami og dugang mahitungod sa tinuod nga operasyon sa LGU.

---

## Question 4 — How does role-based access control work in your system?

> **Why it will be asked:** RBAC is a core security and design concept in the system. Panels will ask about it to test whether researchers truly implemented it or just claimed it. They may also ask what happens if a user tries to access a restricted page.

### English

**Q:** How does the role-based access control work in your system, and what happens if a user tries to access a page they are not permitted to see?

**A:** Our system has three roles: Administrator, Dispatcher, and Driver. Each role is assigned when an account is created and is stored in the database. When a user signs in, NextAuth.js issues a JWT session token that includes the user's role. Every API endpoint and protected page calls a function called `assertRole` that checks the role in the session against the allowed roles for that endpoint. If the role does not match, the server returns a 403 Forbidden error and the user is denied access — not redirected to a login page, but actively blocked at the server level. On the front end, the sidebar navigation only renders menu items that are permitted for the signed-in user's role, so buttons and links that don't belong to a role simply do not appear. This means a driver cannot access routes management or reporting even if they manually type the URL — the API will reject the request.

---

### Bisaya

**P:** Giunsa pagbuhat ang role-based access control sa inyong sistema, ug unsa ang mahitabo kon ang usa ka user mosulay og access sa page nga dili niya katugutan nga makita?

**S:** Ang atong sistema adunay tulo ka role: Administrator, Dispatcher, ug Driver. Ang matag role gi-assign sa paghimo sa account ug gitipig sa database. Sa pag-sign in sa user, ang NextAuth.js mag-isyu og JWT session token nga naglakip sa role sa user. Ang matag API endpoint ug protected page motawag og function nga gitawag og `assertRole` nga nagsusi sa role sa session batok sa mga gitugotan nga role alang sa maong endpoint. Kon dili motakdo ang role, ang server magbalik og 403 Forbidden nga error ug ang user dili tugutan sa pag-access — dili i-redirect sa login page, kondili aktibo nga gibabagan sa lebel sa server. Sa front end, ang sidebar navigation magpakita lamang sa mga menu item nga gitugotan alang sa role sa naka-sign in nga user, mao nga ang mga button ug link nga dili iya sa usa ka role dili lang makita. Nagpasabot kini nga ang usa ka driver dili ma-access ang routes management o reporting bisan isulod nila ang URL sa kamot — ang API magbalibad sa hangyo.

---

## Question 5 — What is ISO 9126 and why did you use it to evaluate your system?

> **Why it will be asked:** ISO 9126 is the chosen evaluation framework and panels will always test whether researchers can explain it. They may also ask why ISO 9126 was chosen over other frameworks like SUS (System Usability Scale) or TAM (Technology Acceptance Model).

### English

**Q:** What is the ISO 9126 framework, and why did you use it to evaluate your system instead of other frameworks?

**A:** ISO 9126 is an international standard published by the International Organization for Standardization for evaluating the quality of software products. It measures six quality characteristics: functionality, efficiency, usability, reliability, maintainability, and portability. We chose ISO 9126 because it is comprehensive — it does not only measure whether users find the system easy to use, but also whether it performs correctly, securely, and consistently. This is important for an LGU system where data accuracy and reliability are critical. Other frameworks like SUS focus only on usability, while TAM focuses on user acceptance and behavioral intention. ISO 9126 gave us a complete picture of the system's quality across all dimensions, which is appropriate for a software product intended for actual government use.

---

### Bisaya

**P:** Unsa ang ISO 9126 framework, ug ngano nga gigamit ninyo kini sa pagsusi sa inyong sistema imbes ang ubang mga framework?

**S:** Ang ISO 9126 usa ka internasyonal nga pamantayan nga gipatik sa International Organization for Standardization alang sa pagsusi sa kalidad sa mga software product. Gisukat niini ang unom ka kalidad nga kinaiya: functionality, efficiency, usability, reliability, maintainability, ug portability. Gipili namo ang ISO 9126 tungod kay komprehensibo kini — dili lamang kini nagsukod kon kadali ba gamiton sa mga user ang sistema, kondili nagsukod usab kon husto ba ang pagtrabaho niini, luwas, ug konsistente. Importante kini alang sa sistema sa LGU diin kritikal ang katukma sa datos ug reliability. Ang ubang mga framework sama sa SUS nagtutok lamang sa usability, samtang ang TAM nagtutok sa pagtanggap sa user ug sa behavioral intention. Ang ISO 9126 naghatag kanamo og kompleto nga hulagway sa kalidad sa sistema sa tanang dimensyon, nga angay alang sa software product nga gi-intindi alang sa aktuwal nga paggamit sa gobyerno.

---

## Question 6 — What does your Grand Mean of 4.79 mean, and is it a reliable result?

> **Why it will be asked:** The evaluation result is the most scrutinized part of any capstone. Panels will question whether the sample size is sufficient, whether respondents were objective, and what the rating scale means. They may challenge whether the result is inflated.

### English

**Q:** Your Grand Mean is 4.79 out of 5.00. What does this mean, and how can you assure the panel that the result is reliable and not inflated?

**A:** A Grand Mean of 4.79 out of 5.00 corresponds to the verbal description of "Strongly Agree," meaning our respondents strongly agreed that the system meets the quality standards measured by ISO 9126 across all six dimensions. To ensure reliability, we selected a diverse set of respondents including LGU administrators, dispatchers, drivers, and IT evaluators — people who actually interact with systems like this professionally and can evaluate it critically. We used a Likert scale from 1 to 5, where 1 means Strongly Disagree and 5 means Strongly Agree. The respondents evaluated the system independently and were given clear criteria for each question. We acknowledge that no evaluation is perfect and that a larger sample size would produce more statistically significant results. However, the evaluation follows the accepted method for capstone-level research in the Philippines and the result is consistent across all six quality dimensions, which supports its validity.

---

### Bisaya

**P:** Ang inyong Grand Mean kay 4.79 sa 5.00. Unsa kini ang kahulogan, ug giunsa ninyo pagsiguro sa panel nga ang resulta kasaligan ug dili gipataas?

**S:** Ang Grand Mean nga 4.79 sa 5.00 katumbas sa verbal description nga "Strongly Agree," nagpasabot nga ang atong mga respondente kusganong nagkauyon nga ang sistema nakatubag sa mga pamantayan sa kalidad nga gisukat sa ISO 9126 sa tanang unom ka dimensyon. Aron masiguro ang kasaligan, nagpili kami og lain-laing mga respondente lakip na ang mga administrator sa LGU, mga dispatcher, driver, ug mga evaluator sa IT — mga tawo nga nagtrabaho sa mga sistema nga ingon niini sa propesyonal ug makasusi niini nga kritikal. Gigamit namo ang Likert scale gikan 1 hangtod 5, diin ang 1 nagpasabot og Strongly Disagree ug 5 nagpasabot og Strongly Agree. Ang mga respondente nagsusi sa sistema nga independyente ug gihatagan sila og klaro nga pamantayan alang sa matag pangutana. Giila namo nga walay pagsusi nga hingpit ug ang mas dako nga sample size maghatag og mas estadistikanhon nga makabuluhang resulta. Bisan pa, ang pagsusi nagsunod sa ginatanggap nga pamaagi alang sa capstone-level nga pananaliksik sa Pilipinas ug ang resulta konsistente sa tanang unom ka kalidad nga dimensyon, nga nagsuporta sa valididad niini.

---

## Question 7 — How does your system handle data security?

> **Why it will be asked:** Security is a required topic for any system handling user accounts and government data. The panel will test whether researchers implemented real security measures or just claimed they did.

### English

**Q:** How does your system protect sensitive data, such as user passwords and operational records?

**A:** Our system implements several security layers. First, passwords are never stored in plain text — they are hashed using bcryptjs with a cost factor of 10, which means even if the database were compromised, the actual passwords cannot be recovered. Second, authentication is managed by NextAuth.js using JSON Web Tokens with automatic encryption and expiration, preventing session hijacking. Third, every API endpoint performs server-side role verification through the `assertRole` function — there is no way to bypass it from the client side. Fourth, Prisma ORM protects against SQL injection by using parameterized queries for all database access. Fifth, the system uses environment variables to store sensitive configuration such as the database connection string and the NextAuth secret, which are never committed to the codebase. These measures collectively protect both user credentials and operational data from unauthorized access.

---

### Bisaya

**P:** Giunsa pagpanalipod sa inyong sistema ang sensitibong datos, sama sa mga password sa user ug mga rekord sa operasyon?

**S:** Ang atong sistema naglapat og daghang mga layer sa seguridad. Una, ang mga password dili gyud gitipig sa plain text — gi-hash kini gamit ang bcryptjs nga may cost factor nga 10, nagpasabot nga bisan pa og makompromiso ang database, ang aktwal nga mga password dili na mabalik. Ikaduha, ang authentication gipamahala sa NextAuth.js gamit ang JSON Web Tokens nga adunay awtomatikong encryption ug expiration, nga nagpugong sa session hijacking. Ikatulo, ang matag API endpoint naghimo og server-side role verification pinaagi sa `assertRole` nga function — walay paagi nga ma-bypass kini gikan sa client side. Ikaupat, ang Prisma ORM nagpanalipod batok sa SQL injection pinaagi sa paggamit og parameterized queries alang sa tanan nga pag-access sa database. Ikalima, ang sistema naggamit og environment variables sa pagtipig og sensitibong configuration sama sa database connection string ug ang NextAuth secret, nga dili gyud gi-commit sa codebase. Kining mga sukod nagpanalipod sa kolektibo sa mga kredensyal sa user ug datos sa operasyon gikan sa dili awtorisadong pag-access.

---

## Question 8 — What are the limitations of your system?

> **Why it will be asked:** This is a classic defense question used to test intellectual honesty. Panels respect researchers who can clearly articulate what their system cannot do. Researchers who claim no limitations are seen as overconfident or unprepared.

### English

**Q:** What are the limitations of your Garbage Tracking System?

**A:** We identified three main limitations. First, the map view requires that stop coordinates — latitude and longitude — be manually entered when creating a route. If a stop has no coordinates, it will not appear on the map; the system does not automatically geocode addresses. Second, the system is designed for web browsers and does not have a dedicated offline-capable mobile application. Drivers must have an internet connection to log pickups, which may be a challenge in areas of Socorro with weak signal. Third, the system is designed specifically for garbage collection operations and would require significant customization to adapt to other logistics or municipal service tracking domains. These limitations represent potential areas for future development and are acknowledged in our recommendations chapter.

---

### Bisaya

**P:** Unsa ang mga limitasyon sa inyong Garbage Tracking System?

**S:** Nahibal-an namo ang tulo ka nag-unang limitasyon. Una, ang map view nagkinahanglan nga ang mga coordinate sa istasyon — latitude ug longitude — i-enter sa kamot sa paghimo og rota. Kon ang usa ka istasyon walay coordinates, dili kini makita sa mapa; ang sistema dili awtomatikong mag-geocode sa mga address. Ikaduha, ang sistema gidisenyo alang sa mga web browser ug wala'y dedikado nga offline-capable nga mobile application. Ang mga driver kinahanglan mag-internet connection aron ma-log ang mga pickup, nga mahimong usa ka hagit sa mga dapit sa Socorro nga may mahuyang nga signal. Ikatulo, ang sistema gidisenyo espesipiko alang sa mga operasyon sa koleksyon sa basura ug magkinahanglan og makabuluhang customization aron mapahiangay sa ubang mga logistics o municipal service tracking nga domain. Kining mga limitasyon nagrepresentar sa mga potensyal nga lugar alang sa umaabot nga pag-develop ug giila sa amo sa amo nga kapitulo sa rekomendasyon.

---

## Question 9 — How does the public schedule benefit the community, and why is this important for an LGU system?

> **Why it will be asked:** The public-facing module is unique and socially significant. Panels will test whether researchers can articulate the civic value of transparency in government services — this connects the technical work to real community impact.

### English

**Q:** How does the public collection schedule module benefit residents, and why is this feature important for a local government system?

**A:** The public schedule module allows any resident of Socorro to open their browser, go to the schedule page, and see exactly which barangays are scheduled for garbage collection on any given day — without creating an account or logging in. They can see the route, the truck assigned, and the real-time status of each stop, including whether a stop was completed or missed and why. This is important for two reasons. First, it promotes government transparency — residents no longer have to call the municipal hall to ask when their garbage will be collected. Second, it builds public trust in the LGU by showing that collection activities are being tracked and documented. In the context of e-governance, which Philippine government policy actively promotes through the DICT and related agencies, making government services digitally accessible to citizens is not just a convenience — it is a responsibility. This feature directly fulfills that principle.

---

### Bisaya

**P:** Giunsa pagpabenepisyo sa public schedule module ang mga residente, ug ngano nga importante kining feature alang sa sistema sa lokal nga gobyerno?

**S:** Ang public schedule module nagtugot sa bisan unsang residente sa Socorro nga ablihan ang ilang browser, adto sa schedule page, ug makita ang eksakto kung unsang mga barangay ang naka-skedyul alang sa koleksyon sa basura sa bisan unsang adlaw — nga dili kinahanglang maghimo og account o mag-log in. Makita nila ang rota, ang truck nga gi-assign, ug ang real-time nga kahimtang sa matag istasyon, lakip ang kon ang istasyon nakompleto o napasagdan ug ngano. Importante kini sa duha ka rason. Una, nagsulong kini og transparency sa gobyerno — ang mga residente dili na kinahanglang tumawag sa munisipyo aron mangutana kung kanus-a makuha ang ilang basura. Ikaduha, nagpatukod kini og tiwala sa publiko sa LGU pinaagi sa pagpakita nga ang mga aktibidad sa koleksyon ginsundan ug gidokumento. Sa konteksto sa e-governance, nga aktibong gisuportahan sa patakaran sa gobyerno sa Pilipinas pinaagi sa DICT ug mga kaugnay nga ahensya, ang paghimo sa mga serbisyo sa gobyerno nga digital nga naa-access sa mga mamamayan dili lamang usa ka kaginhawa — usa kini ka responsibilidad. Direkta nga natuman sa feature na ito ang maong prinsipyo.

---

## Question 10 — What makes your system different from existing garbage tracking or route management systems?

> **Why it will be asked:** Panels always probe originality and local context. They want to know whether the researchers reviewed existing systems and whether theirs adds genuine value, especially for a small municipality like Socorro.

### English

**Q:** What makes your system different from or better than existing garbage collection or route management systems available today?

**A:** Most existing garbage management systems are designed for large cities or private waste management companies, are expensive to license, and are not tailored to the workflow of Philippine Local Government Units. Our system differs in three ways. First, it is built specifically for the barangay-level structure of the Municipality of Socorro — the 14 barangays, the LGU's three-role staff structure of Admin, Dispatcher, and Driver, and the Philippine timezone are all built into the system. Second, it includes a public-facing schedule module, which most commercial systems do not provide because their clients are private companies, not transparency-accountable government units. Third, it is a free, open, and maintainable system built on modern open-source technologies — Next.js, PostgreSQL, and Prisma — meaning the LGU is not locked into a vendor contract and can have it maintained or extended by local IT personnel or future capstone researchers.

---

### Bisaya

**P:** Unsa ang nagpahimo sa inyong sistema nga lahi o mas maayo kaysa sa mga naa na nga sistema sa koleksyon sa basura o pamamahala sa rota karon?

**S:** Kadaghanan sa mga naa na nga sistema sa pamamahala sa basura gidisenyo alang sa dagkong mga lungsod o pribadong mga kumpanya sa pamamahala sa basura, mahal ang lisensya, ug dili gi-angkla sa workflow sa mga Local Government Unit sa Pilipinas. Ang atong sistema lahi sa tulo ka paagi. Una, espesipikong gitukod kini alang sa istraktura sa barangay-level sa Munisipyo sa Socorro — ang 14 ka barangay, ang tulo-ka-role nga istraktura sa staff sa LGU nga Admin, Dispatcher, ug Driver, ug ang Philippine timezone itod tanan gilakip sa sistema. Ikaduha, naglakip kini og public-facing schedule module, nga kadaghanan sa komersyal nga mga sistema dili naghatag tungod kay ang ilang mga kliyente mga pribadong kumpanya, dili mga yunit sa gobyerno nga accountable sa transparency. Ikatulo, libre, bukas, ug maintainable nga sistema kini nga gitukod sa modernong open-source nga mga teknolohiya — Next.js, PostgreSQL, ug Prisma — nagpasabot nga ang LGU dili nakakulong sa kontrata sa vendor ug mahimo kining ipabantay o palaparon sa lokal nga IT personnel o umaabot nga mga capstone researcher.

---

## Question 11 — Why did you use Next.js and not a simpler framework like plain PHP or WordPress?

> **Why it will be asked:** Technology choice is always questioned, especially when the panel includes IT-literate members. They may challenge why the team used a complex JavaScript framework when simpler tools exist for small municipalities.

### English

**Q:** Why did you choose Next.js over simpler alternatives like PHP or a CMS like WordPress?

**A:** We chose Next.js because it allows us to build both the front end and the API backend in a single, unified codebase using one language — TypeScript. This reduces complexity and makes the system easier to maintain. PHP with a separate front end would require managing two codebases and two deployments. WordPress is a content management system designed for websites and blogs, not for role-based operational applications with real-time data fetching and relational databases. Next.js also provides built-in support for server-side rendering, which improves page load speed, and integrates directly with NextAuth.js for authentication. Additionally, Next.js is used in production by major organizations and is actively maintained, ensuring the system remains viable long-term. For a system that needs role-based access control, real-time data updates, and a relational database, Next.js is the more appropriate and professional choice.

---

### Bisaya

**P:** Ngano nga gipili ninyo ang Next.js kaysa sa mas simple nga mga alternatibo sama sa PHP o CMS nga WordPress?

**S:** Gipili namo ang Next.js tungod kay gitugotan kami niini nga magtukod sa front end ug API backend sa usa, unipikadong codebase gamit ang usa ka pinulongan — TypeScript. Kini nagpamenos sa kumplikasyon ug nagpadali sa pagmantenir sa sistema. Ang PHP nga adunay lainlain nga front end magkinahanglan og pagmahala sa duha ka codebase ug duha ka deployment. Ang WordPress usa ka content management system nga gidisenyo alang sa mga website ug blog, dili alang sa role-based operational application nga adunay real-time data fetching ug relational database. Ang Next.js naglakip usab og built-in support alang sa server-side rendering, nga nagpabilis sa pagkarga sa page, ug direkta nga nag-integrate sa NextAuth.js alang sa authentication. Dugang pa, ang Next.js gigamit sa produksyon sa dagkong mga organisasyon ug aktibong gipabantay, nga nagsiguro nga ang sistema magpabilin nga viable sa dugay nga panahon. Alang sa sistema nga nagkinahanglan og role-based access control, real-time data update, ug relational database, ang Next.js ang mas angay ug propesyonal nga pagpili.

---

## Question 12 — What are your recommendations for the future improvement of this system?

> **Why it will be asked:** Recommendations show that researchers can think beyond the current scope. Panels use this question to evaluate critical thinking and awareness of the system's growth potential. It also opens the door for future researchers to build on this work.

### English

**Q:** What are your recommendations for future improvements or enhancements to this system?

**A:** We have five recommendations. First, **geocoding integration** — the system should automatically convert a stop's address into latitude and longitude coordinates so the dispatcher does not need to enter them manually. Second, **a dedicated mobile application** — a native Android or iOS app for drivers would allow offline pickup logging that syncs when a connection is available, solving the weak-signal problem in remote barangays. Third, **SMS or push notifications** — drivers should receive a notification when a route is assigned to them, and dispatchers should be alerted when a stop is marked missed. Fourth, **advanced analytics** — adding driver performance metrics, trend analysis over months, and export to CSV or PDF would support LGU budget planning and accountability reporting. Fifth, **multi-municipality support** — the system could be expanded to serve other municipalities in Surigao del Norte, creating a provincial-level waste management platform under a single deployment.

---

### Bisaya

**P:** Unsa ang inyong mga rekomendasyon alang sa umaabot nga pagpapabuti o pagpapalawig sa sistema?

**S:** Adunay kami lima ka rekomendasyon. Una, **geocoding integration** — ang sistema kinahanglan awtomatikong mag-convert sa address sa istasyon ngadto sa latitude ug longitude coordinates aron ang dispatcher dili na kinahanglang i-enter kini sa kamot. Ikaduha, **dedikadong mobile application** — ang native Android o iOS nga app alang sa mga driver magtugot og offline pickup logging nga mag-sync kon adunay koneksyon, nga magsulbad sa problema sa mahuyang signal sa mga layo nga barangay. Ikatulo, **SMS o push notifications** — ang mga driver kinahanglan makadawat og notification kung gi-assign sila og rota, ug ang mga dispatcher kinahanglan maalerto kung ang usa ka istasyon na-mark nga napasagdan. Ikaupat, **advanced analytics** — ang pagdugang og driver performance metrics, trend analysis sa sulod sa mga buwan, ug export ngadto sa CSV o PDF makasuporta sa pagplano sa budget sa LGU ug accountability reporting. Ikalima, **multi-municipality support** — ang sistema mahimong palaparon aron magsilbi sa ubang mga munisipyo sa Surigao del Norte, nagmugna og provincial-level nga plataporma sa pamamahala sa basura sa ilawom sa usa ka deployment.

---

## Bonus: Quick-Fire Answers for Short Follow-Up Questions

| Question | English Answer | Bisaya Answer |
|---|---|---|
| What database did you use? | PostgreSQL, accessed through the Prisma ORM. | PostgreSQL, giakses pinaagi sa Prisma ORM. |
| How many barangays does Socorro have? | 14 barangays, all of which can be registered in the system. | 14 barangay, tanan mahimong i-register sa sistema. |
| Why is Philippine timezone important? | UTC and Philippine time differ by 8 hours. Without PHT, a pickup logged after midnight would be counted on the wrong calendar day. | Ang UTC ug Philippine time nagkalahi og 8 oras. Kung wala ang PHT, ang pickup nga gi-log human sa tungang gabii maihap sa sayong adlaw. |
| What does RBAC stand for? | Role-Based Access Control. | Role-Based Access Control — ang pagkontrol sa pag-access base sa papel sa user. |
| Who are the target users? | LGU administrators, dispatchers, drivers, and Socorro residents. | Mga administrator sa LGU, mga dispatcher, driver, ug mga residente sa Socorro. |
| Is the system already deployed? | The system is deployed locally and was evaluated by LGU respondents during the study period. | Ang sistema gi-deploy sa lokal ug gisusi sa mga respondente sa LGU sa panahon sa pag-aaral. |

---

*Prepared for the Capstone Defense of the Garbage Tracking System · Bucas Grande Foundation College · College of Information Technology · Socorro, Surigao del Norte · 2026*
