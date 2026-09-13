import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker

BASE_DIR=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH=os.path.join(BASE_DIR,".env")

load_dotenv(ENV_PATH)

DATABASE_URL=os.getenv("DATABASE_URL")

engine=create_engine(DATABASE_URL)

SessionLocal=sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()