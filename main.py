from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path
from uuid import uuid4

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
class Expense(BaseModel):
    name:str
    amount:float 
    quantity:int

FILE_PATH=Path(__file__).parent/ "expense.json"

def load_expenses():
    if not FILE_PATH.exists():
        return[]
    with open(FILE_PATH,"r")as file:
        return json.load(file)
def save_expenses(expenses):
    with open(FILE_PATH,"w")as file:
        json.dump(expenses,file, indent=4)

@app.get("/hello")
def say_hello():
    return{"message":"Hello from Python"}

@app.post("/expenses")
def add_expenses(expense:Expense):
    expenses=load_expenses()

    new_expense={
        "id":str(uuid4()),
        "name":expense.name,
        "amount":expense.amount,
        "quantity":expense.quantity
    }
    expenses.append(new_expense)
    save_expenses(expenses)
    return new_expense
@app.delete("/expenses/{expense_id}")
def delete_expenses(expense_id:str):
    expenses=load_expenses()

    for expense in expenses:
        if expense['id']==expense_id:
            expenses.remove(expense)
            save_expenses(expenses)
            return{"message": "Expense Deleted."}
    raise HTTPException(status_code=404, detail="Expense not found.")

@app.get("/expenses")
def get_expenses():
    return load_expenses()
