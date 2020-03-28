from django.test import TestCase

from novel.models import Novel


class GetNovelTestCase(TestCase):
    def setUp(self):
        Novel.objects.create(title='Az ördögűző', private=False, lore='Ezt csak a teszthez használom',
                             content='Forgó fejű baba', lang='HU')

