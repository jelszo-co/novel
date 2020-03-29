import freezegun
import json
from django.test import TestCase, RequestFactory, Client

from authorization.models import User
from novel.models import Novel


class GetNovelTestCase(TestCase):
    @freezegun.freeze_time('2020.01.01T12:00:00')
    def setUp(self):
        self.n1 = Novel.objects.create(title='Az ördögűző', private=False, lore='Ezt csak a teszthez használom',
                                       content='Forgó fejű baba', lang='HU')
        self.n2 = Novel.objects.create(title='Utolsó percek', private=True,
                                       lore='Az igazi biztos kinn van az oldalon ;)',
                                       content='Halál', lang='HU')
        self.stranger = User.objects.create(uid='unknown_user', isAuthenticated=False)
        self.anonim = User.objects.create(uid='anonim_user', isAnonymous=True)
        self.auth = User.objects.create(uid='authenticated_user', isAnonymous=False)
        self.admin = User.objects.create(uid='admin', isAnonymous=False, isAdmin=True)

        self.factory = RequestFactory()
        self.client = Client()

    def test_get_all_novel(self):
        response = self.client.post('/api/novel/')
        self.assertEqual(405, response.status_code)
        response = self.client.get('/api/novel/')
        self.assertEqual(200, response.status_code)
        decoded = json.loads(response.content)
        self.assertEqual(set(decoded.keys()), {'HU', 'EN'})
        self.assertEqual(len(decoded['EN']), 0)
        self.assertEqual(len(decoded['HU']), 1)
        self.assertEqual(set(decoded['HU'][0]['2020'][0].keys()), {'title', 'uploadedAt', 'lore', 'path'})
