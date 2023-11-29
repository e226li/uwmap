import unittest
from fastapi.testclient import TestClient
from backend_api.api import app

client = TestClient(app)


class TestBackend(unittest.TestCase):
    def setUp(self):
        pass

    def test_example(self):
        pass

    def test_example_2(self):
        response = client.get("/items/foo", headers={"X-Token": "baz"})
        assert response.status_code == 200
        assert response.json() == {
            "id": "foo",
            "title": "Foo",
            "description": "bar",
        }
    