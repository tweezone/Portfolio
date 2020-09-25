
export function getPermissions(permissionsIds){
    let init=[
        [ // Index = 0
            {id: 1, name: 'Dashboard', value: false},       // Index = 0
        ],

        [ // Index = 1
            {id: 2, name: 'Doc Management', value: false},  // Index = 0
            {id: 3, name: 'Doc List', value: false},
            {id: 4, name: 'Doc Add', value: false},
            {id: 5, name: 'Doc Update', value: false},
            {id: 6, name: 'Doc Delete', value: false},
            {id: 7, name: 'Doc Comment', value: false},
            {id: 8, name: 'Doc Category', value: false},    // Index = 6
        ],

        [ // Index = 2
            {id: 9, name: 'Video Management', value: false},	// Index = 0
            {id: 10, name: 'Video List', value: false},
            {id: 11, name: 'Video Add', value: false},
            {id: 12, name: 'Video Update', value: false},
            {id: 13, name: 'Video Delete', value: false},
            {id: 14, name: 'Video Comment', value: false},
            {id: 15, name: 'Video Category', value: false},     // Index = 6
        ],

        [ // Index = 3
            {id: 16, name: 'Event Management', value: false},       // Index = 0
            {id: 17, name: 'Event List', value: false},
            {id: 18, name: 'Event Add', value: false},
            {id: 19, name: 'Event Update', value: false},
            {id: 20, name: 'Event Delete', value: false},
            {id: 21, name: 'Event Comment', value: false},
            {id: 22, name: 'Event Category', value: false},         // Index = 6
        ],

        [ // Index = 4
            {id: 23, name: 'Lesson Management', value: false},      // Index = 0
            {id: 24, name: 'Lesson List', value: false},
            {id: 25, name: 'Lesson Add', value: false},
            {id: 26, name: 'Lesson Update', value: false},
            {id: 27, name: 'Lesson Delete', value: false},
            {id: 28, name: 'Lesson Comment', value: false},
            {id: 29, name: 'Lesson Category', value: false},        // Index = 6
        ],

        [ // Index = 5
            {id: 30, name: 'Question Mangement', value: false},     // Index = 0
            {id: 31, name: 'Question List', value: false},
            {id: 32, name: 'Edit Answers', value: false},
            {id: 33, name: 'Question Add', value: false},
            {id: 34, name: 'Question Update', value: false},
            {id: 35, name: 'Question Delete', value: false},
            {id: 36, name: 'Question Category', value: false},      // Index = 6
        ],

        [ // Index = 6
            {id: 37, name: 'Health Management', value: false},      // Index = 0
            {id: 38, name: 'Doctor List', value: false},
            {id: 39, name: 'Doctor Add', value: false},
            {id: 40, name: 'Doctor Update', value: false},
            {id: 41, name: 'Doctor Delete', value: false},
            {id: 42, name: 'Doctor Category', value: false},        // Index = 5
        ],

		[ // Index = 7
            {id: 43, name: 'User Management', value: false},        // Index = 0
            {id: 44, name: 'User List', value: false},
            {id: 45, name: 'User Add', value: false},
            {id: 46, name: 'User Update', value: false},
            {id: 47, name: 'User Delete', value: false},
            {id: 48, name: 'User View', value: false},
            {id: 49, name: 'User groups', value: false},
            {id: 50, name: 'User Permissions', value: false},
            {id: 51, name: 'User Log', value: false},               // Index = 8
        ],

		[ // Index = 8
            {id: 52, name: 'Product Management', value: false},     // Index = 0
            {id: 53, name: 'Product List', value: false},
            {id: 54, name: 'Product Add', value: false},
            {id: 55, name: 'Product Update', value: false},
            {id: 56, name: 'Product Delete', value: false},
            {id: 57, name: 'Product Category', value: false},
            {id: 58, name: 'Product Attribute', value: false},
            {id: 59, name: 'Product Attribute Group', value: false} // Index = 7            
        ],

        [ // Index = 9
            {id: 60, name: 'Location Mnangement', value: false},       // Index = 0
            {id: 61, name: 'Country List', value: false},     
            {id: 62, name: 'Country Update', value: false},
            {id: 63, name: 'Province List', value: false},
            {id: 64, name: 'Province Add', value: false},
            {id: 65, name: 'Province Update', value: false},
            {id: 66, name: 'Province Delete', value: false},
            {id: 67, name: 'City List', value: false},
            {id: 68, name: 'City Add', value: false},
            {id: 69, name: 'City Update', value: false},
            {id: 70, name: 'City Delete', value: false}       // Index = 10
        ]
    ];

    if(permissionsIds){
        init.forEach(one1=>{
            one1.forEach(one2=>{
                if(permissionsIds.includes(String(one2.id)))
                    one2.value = true;
                else one2.value = false;
            })
        })
    }
    return init;
}