import { Message } from "@/model/User";

export interface ApiResponse{
    success : boolean,
    message : string,
    isAcceptingMEssage? : boolean,
    messages? : Array<Message>
}