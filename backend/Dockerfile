FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./main.py main.py

ENV PYTHONPATH=/code
ENV NEBIUS_KEY="default"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
