import productImg from "../../../../public/assets/img/blogs_img.jpg";
import about_us_img from "../../../../public/assets/img/about_us_img.png";

const enquiesData = [
  {
    id: "JAP001",
    images: [productImg, about_us_img],
    ProductName: "Self-Centering CNC Vise",
    companyName: "Jaypee Associates",
    model: "4-inch jaw width",
    category: {
      categoryName: "Workholding Vises",
      subcategoryName: "Self-Centering Vises"
    },
    description: "High-precision self-centering vise designed for CNC machining centers. Features hardened steel construction and precision ground surfaces for optimal workpiece holding stability.",
    status: "Pending",
    userData: {
      quantity: 10,
      customerName: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      companyName: "Doe Industries",
      comment: "Looking forward to receiving the quotation."
    },
    enquiry: {
      companyName: "",
      gstNumber: "",
      address: "",
      sameAsAddress: "",
      deliveryAddress: ""
    }
  },
  {
    id: "JAP002",
    images: [productImg, about_us_img],
    ProductName: "Quick Change Pallet System",
    companyName: "Jaypee Associates",
    model: "Single Station",
    category: {
      categoryName: "Quick Change Systems",
      subcategoryName: "Pallet Systems"
    },
    description: "Advanced zero-point pallet system offering rapid workpiece changeover with excellent repeatability. Ideal for high-volume production environments requiring frequent setup changes.",
    status: "Quotation Received",
    userData: {
      quantity: 5,
      customerName: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      companyName: "Smith Manufacturing",
      comment: "Please provide the best price."
    },
    enquiry: {
      companyName: "Smith Manufacturing",
      gstNumber: "27AAAPL5678D1ZQ",
      address: "456 Elm St, Metropolis",
      sameAsAddress: "no",
      deliveryAddress: "789 Oak St, Metropolis"
    }
  },
  {
    id: "JAP003",
    images: [productImg, about_us_img],
    ProductName: "5-Axis Tombstone Fixture",
    companyName: "Jaypee Associates",
    model: "2-Sided Configuration",
    category: {
      categoryName: "Tombstone Fixtures",
      subcategoryName: "Multi-Axis Fixtures"
    },
    description: "Multi-sided tombstone fixture specifically designed for 5-axis machining applications. Features modular mounting system and high-precision indexing capabilities.",
    status: "Pending",
    userData: {
      quantity: 3,
      customerName: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-123-4567",
      companyName: "Johnson Tools",
      comment: "Need this urgently."
    },
    enquiry: {
      companyName: "",
      gstNumber: "",
      address: "",
      sameAsAddress: "",
      deliveryAddress: ""
    }
  },
  {
    id: "JAP004",
    images: [productImg, about_us_img],
    ProductName: "Precision Dovetail Vise",
    companyName: "Jaypee Associates",
    model: "Standard Capacity",
    category: {
      categoryName: "Workholding Vises",
      subcategoryName: "Dovetail Vises"
    },
    description: "Specialized dovetail vise for secure workpiece clamping in heavy-duty machining operations. Includes hardened jaws and precision dovetail surfaces for maximum holding power.",
    status: "Quotation Received",
    userData: {
      quantity: 7,
      customerName: "Bob Brown",
      email: "bob.brown@example.com",
      phone: "444-555-6666",
      companyName: "Brown Engineering",
      comment: "Please confirm the delivery time."
    },
    enquiry: {
      companyName: "Brown Engineering",
      gstNumber: "27AAAPL1122F1ZQ",
      address: "321 Cedar St, Star City",
      sameAsAddress: "no",
      deliveryAddress: "654 Maple St, Star City"
    }
  },
  {
    id: "JAP005",
    images: [productImg, about_us_img],
    ProductName: "Universal Indexing Head",
    companyName: "Jaypee Associates",
    model: "Manual Indexing",
    category: {
      categoryName: "Indexing Solutions",
      subcategoryName: "Universal Indexing"
    },
    description: "Versatile indexing head for precision angular positioning in machining operations. Features 5-degree indexing intervals and robust locking mechanism for secure workholding.",
    status: "Pending",
    userData: {
      quantity: 2,
      customerName: "Charlie Davis",
      email: "charlie.davis@example.com",
      phone: "777-888-9999",
      companyName: "Davis Precision",
      comment: "Looking for bulk order discount."
    },
    enquiry: {
      companyName: "",
      gstNumber: "",
      address: "",
      sameAsAddress: "",
      deliveryAddress: ""
    }
  },
  {
    id: "JAP006",
    images: [productImg, about_us_img],
    ProductName: "Hydraulic Vise",
    companyName: "Jaypee Associates",
    model: "4-inch jaw width",
    category: {
      categoryName: "Workholding Vises",
      subcategoryName: "Self-Centering Vises"
    },
    description: "High-pressure hydraulic vise for secure and stable workpiece clamping. Ideal for heavy-duty machining operations requiring consistent clamping force.",
    status: "Quotation Received",
    userData: {
      quantity: 4,
      customerName: "David Evans",
      email: "david.evans@example.com",
      phone: "222-333-4444",
      companyName: "Evans Machining",
      comment: "Need technical specifications."
    },
    enquiry: {
      companyName: "Evans Machining",
      gstNumber: "27AAAPL5566H1ZQ",
      address: "654 Spruce St, Coast City",
      sameAsAddress: "no",
      deliveryAddress: "321 Willow St, Coast City"
    }
  },
  {
    id: "JAP007",
    images: [productImg, about_us_img],
    ProductName: "Magnetic Chuck",
    companyName: "Jaypee Associates",
    model: "Single Station",
    category: {
      categoryName: "Quick Change Systems",
      subcategoryName: "Pallet Systems"
    },
    description: "Powerful magnetic chuck for holding ferrous workpieces during machining. Features strong magnetic force and easy on/off control.",
    status: "Pending",
    userData: {
      quantity: 6,
      customerName: "Eve Foster",
      email: "eve.foster@example.com",
      phone: "111-222-3333",
      companyName: "Foster Tools",
      comment: "Please provide the warranty details."
    },
    enquiry: {
      companyName: "",
      gstNumber: "",
      address: "",
      sameAsAddress: "",
      deliveryAddress: ""
    }
  },
  {
    id: "JAP008",
    images: [productImg, about_us_img],
    ProductName: "Rotary Table",
    companyName: "Jaypee Associates",
    model: "2-Sided Configuration",
    category: {
      categoryName: "Tombstone Fixtures",
      subcategoryName: "Multi-Axis Fixtures"
    },
    description: "Precision rotary table for accurate angular positioning in machining operations. Features smooth rotation and robust locking mechanism.",
    status: "Quotation Received",
    userData: {
      quantity: 8,
      customerName: "Frank Green",
      email: "frank.green@example.com",
      phone: "666-777-8888",
      companyName: "Green Manufacturing",
      comment: "Interested in long-term partnership."
    },
    enquiry: {
      companyName: "Green Manufacturing",
      gstNumber: "27AAAPL9900J1ZQ",
      address: "456 Maple St, Blüdhaven",
      sameAsAddress: "no",
      deliveryAddress: "789 Pine St, Blüdhaven"
    }
  },
  {
    id: "JAP009",
    images: [productImg, about_us_img],
    ProductName: "Tool Presetter",
    companyName: "Jaypee Associates",
    model: "Standard Capacity",
    category: {
      categoryName: "Workholding Vises",
      subcategoryName: "Dovetail Vises"
    },
    description: "Advanced tool presetter for precise measurement and setting of cutting tools. Features high-resolution measurement and user-friendly interface.",
    status: "Pending",
    userData: {
      quantity: 9,
      customerName: "Grace Harris",
      email: "grace.harris@example.com",
      phone: "999-000-1111",
      companyName: "Harris Tools",
      comment: "Please provide the shipping cost."
    },
    enquiry: {
      companyName: "",
      gstNumber: "",
      address: "",
      sameAsAddress: "",
      deliveryAddress: ""
    }
  },
  {
    id: "JAP010",
    images: [productImg, about_us_img],
    ProductName: "CNC Lathe Chuck",
    companyName: "Jaypee Associates",
    model: "Manual Indexing",
    category: {
      categoryName: "Indexing Solutions",
      subcategoryName: "Universal Indexing"
    },
    description: "High-precision CNC lathe chuck for secure workpiece holding. Features hardened jaws and precision ground surfaces for optimal performance.",
    status: "Quotation Received",
    userData: {
      quantity: 1,
      customerName: "Henry Jackson",
      email: "henry.jackson@example.com",
      phone: "888-999-0000",
      companyName: "Jackson Engineering",
      comment: "Looking for expedited shipping."
    },
    enquiry: {
      companyName: "Jackson Engineering",
      gstNumber: "27AAAPL3344L1ZQ",
      address: "987 Birch St, Fawcett City",
      sameAsAddress: "no",
      deliveryAddress: "654 Spruce St, Fawcett City"
    }
  }
];

export default enquiesData;
