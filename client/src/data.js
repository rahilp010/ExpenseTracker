import ProfileSettings from "./Components/SettingsTabs/ProfileSettings";

const categories = [
    { name: 'Food', color: '#EABDE6' },
    { name: 'Transport', color: '#C1D8C3' },
    { name: 'Shopping', color: '#FF90BB' },
    { name: 'Other', color: '#FFD95F' },
    { name: 'Enjoy', color: '#8ACCD5' },
]

const months = [
    'January',
    'February',
    'March',
    'April',    
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const profileSettings = [
    {
        id: 1,
        label: 'Full Name',
        type: 'text',
        placeHolder: 'Enter your full name',
        name: 'name',
    },
    {
        id: 2,
        label: 'User Name',
        type: 'text',
        placeHolder: 'Enter your username',
        name: 'username',
    },
    {
        id: 3,
        label: 'Phone Number',
        type: 'number',
        placeHolder: 'Enter your Number',
        name: 'phone',
    },
    {
        id: 4,
        label: 'Email',
        type: 'email',
        placeHolder: 'Enter your email',
        name: 'email',
    },
]


export { months, categories, profileSettings }