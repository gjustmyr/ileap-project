from pydantic import BaseModel


class Response(BaseModel):
    status: str
    data: list
    message: str
