

export interface searchFlight {
    flight_id: number;
    destination: string;
    depart: string; // Assuming time format
    airline: string;
    date: string;
    available_seats : number ;
    flight_price : number ;
    baggage_capacity : number;
    extra_baggage_cost:number;
    baggage_allowance:number;
    lounge_access : boolean// Assuming date format
  }
  
  export interface Flight {
    id: number;
    destination: string;
    depart: string; // Assuming time format
    airline: string;
    date: string; // Assuming date format
  }

  export interface Meal {
    id: number;
    snack: boolean;
    mealType: string;
    description: string;
    cost: number;
  }
  
  export interface Flight_details_economy {
    flight_id: number;
    destination: string;
    depart: string;
    airline: string;
    date: string;
    economy_available_seats: number;
    economy_price: string;
    economy_baggage_capacity: number;
    economy_extra_baggage_cost: string;
    meals: Meal[];
    country_code : string;
  }

  export interface Flight_details_business {
    flight_id: number;
    destination: string;
    depart: string;
    airline: string;
    date: string;
    business_available_seats: number;
    business_price: string;
    business_baggage_allowance: number;
    business_lounge_access: boolean;
    meals: Meal[];
    country_code : string;

  }

export interface EconomyFlight {
    id: number;
    baggageCapacity: number;
    extraBaggageCost: number;
    availableSeats: number;
    flightPrice: number;
    flight: Flight; // Assuming a reference to the related Flight object
  }
  export interface BusinessFlight {
    id: number;
    baggageAllowance: number;
    loungeAccess: boolean;
    flightPrice: number;
    availableSeats: number;
    flight: Flight; // Assuming a reference to the related Flight object

  }
  export interface MealOption {
    id: number;
    snack: boolean;
    meal_type: string;
    description: string;
    cost: number;
  }

  export interface EconomyFlightMealOption {
    economyFlightId: number;
    mealId: number;
  }
  
  export interface BusinessFlightMealOption {
    businessFlightId: number;
    mealId: number;
  }

  export interface reservation {
    id:number;
    flightid:number;
    mealid:number;
    userid:number;
    price:number;
    done:boolean;
  }

  export interface user{
    id:number;
    name:string;
    email:string;
    role:boolean;
  }

  export interface Post {
    id: number;
    content: string;
    created_at: string;
    userid: number;
    comment_count: number;
    upvotes: number;
    has_upvoted?: boolean;
  }

interface Comment {
    post_id:number;
    text: string;
}