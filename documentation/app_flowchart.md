flowchart TD
    Start[Start] --> PublicNav[Public Navigation]
    PublicNav -->|Public Home| Home[Home Page]
    PublicNav -->|Explore Taman| Taman[Site Map Page]
    PublicNav -->|View Flora| FloraList[Flora Listing]
    PublicNav -->|View Fauna| FaunaList[Fauna Listing]
    FloraList --> FloraDetail[Flora Detail Page]
    FaunaList --> FaunaDetail[Fauna Detail Page]
    FloraDetail --> ChatBot[Chatbot]
    FaunaDetail --> ChatBot
    PublicNav -->|Admin Login| Login[Admin Login Page]
    Login -->|Valid| Dashboard[Admin Dashboard]
    Login -->|Invalid| LoginFail[Login Failed]
    LoginFail --> Login
    Dashboard -->|Flora CMS| ManageFlora[Manage Flora]
    Dashboard -->|Fauna CMS| ManageFauna[Manage Fauna]
    Dashboard -->|Berita CMS| ManageBerita[Manage Berita]
    ManageFlora --> FloraTable[DataTable]
    ManageFlora --> CreateFlora[Create Flora]
    FloraTable -->|Edit| EditFlora[Edit Flora]
    EditFlora --> SubmitFlora[Submit Changes]
    SubmitFlora --> ApprovalFlow{Approval Required}
    ApprovalFlow -->|Regional| PendingRegional[Pending Regional Approval]
    ApprovalFlow -->|Super| PendingSuper[Pending Super Approval]
    ApprovalFlow -->|Auto Approved| UpdateSuccess[Update Success]
    PendingRegional --> UpdateSuccess
    PendingSuper --> UpdateSuccess
    UpdateSuccess --> Dashboard
    Dashboard --> Logout[Logout]
    Logout --> End[End]