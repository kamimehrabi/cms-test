import { createSlice } from "@reduxjs/toolkit";

export type Car = {
    title: string;
    year: string;
    make: string;
    model: string;
    price: string;
    stock: string;
    vin: string;
    subModel: string;
    mileage: string;
    imageCount: string;
    engine: string;
    exterior: string;
    bodyStyle: string;
    doors: string;
    fuelType: string;
    transmission: string;
    drivetrain: string;
    interior: string;
};

const initialState: Car[] = [
    {
        title: "Mercedes-Benz GLS-Class - 1",
        year: "2018",
        make: "Mercedes-Benz",
        model: "GLS-Class",
        price: "$43,900",
        stock: "646794",
        vin: "4JGDF6EE4JB028456",
        subModel: "GLS 450 4MATIC S...",
        mileage: "108368",
        imageCount: "43",
        engine: "3.0",
        exterior: "White",
        bodyStyle: "SUV",
        doors: "4",
        fuelType: "Gasoline",
        transmission: "Automatic",
        drivetrain: "N/A",
        interior: "Brown",
    },
    {
        title: "Audi Q7",
        year: "2019",
        make: "Audi",
        model: "Q7",
        price: "$49,500",
        stock: "851273",
        vin: "WA1LABC7XKD036789",
        subModel: "Premium Plus",
        mileage: "64021",
        imageCount: "35",
        engine: "3.0",
        exterior: "Blue",
        bodyStyle: "SUV",
        doors: "4",
        fuelType: "Gasoline",
        transmission: "Automatic",
        drivetrain: "AWD",
        interior: "Black",
    },
    {
        title: "BMW X5 xDrive40i",
        year: "2021",
        make: "BMW",
        model: "X5",
        price: "$62,700",
        stock: "923184",
        vin: "5UXCR6C09M9G74512",
        subModel: "xDrive40i",
        mileage: "21231",
        imageCount: "27",
        engine: "3.0",
        exterior: "Gray",
        bodyStyle: "SUV",
        doors: "4",
        fuelType: "Gasoline",
        transmission: "Automatic",
        drivetrain: "AWD",
        interior: "Beige",
    },
    {
        title: "Lexus RX 350",
        year: "2020",
        make: "Lexus",
        model: "RX 350",
        price: "$43,200",
        stock: "416372",
        vin: "2T2BZMCA7LC222315",
        subModel: "Luxury",
        mileage: "36240",
        imageCount: "33",
        engine: "3.5",
        exterior: "Red",
        bodyStyle: "SUV",
        doors: "4",
        fuelType: "Gasoline",
        transmission: "Automatic",
        drivetrain: "AWD",
        interior: "Gray",
    },
    {
        title: "Tesla Model Y Long Range",
        year: "2022",
        make: "Tesla",
        model: "Model Y",
        price: "$55,900",
        stock: "187362",
        vin: "5YJYGDEE7NF257893",
        subModel: "Long Range",
        mileage: "14214",
        imageCount: "41",
        engine: "Electric",
        exterior: "White",
        bodyStyle: "SUV",
        doors: "4",
        fuelType: "Electric",
        transmission: "Automatic",
        drivetrain: "AWD",
        interior: "Black",
    },
];

const carsSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {},
});

export const carsReducer = carsSlice.reducer;

