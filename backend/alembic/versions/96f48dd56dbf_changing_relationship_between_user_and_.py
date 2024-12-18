"""Changing relationship between user and task to be by unique_id instead of id

Revision ID: 96f48dd56dbf
Revises: 958ccda321d9
Create Date: 2024-11-05 15:14:38.954660

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96f48dd56dbf'
down_revision: Union[str, None] = '958ccda321d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('tasks_user_id_fkey', 'tasks', type_='foreignkey')
    op.create_foreign_key(None, 'tasks', 'users', ['user_id'], ['unique_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tasks', type_='foreignkey')
    op.create_foreign_key('tasks_user_id_fkey', 'tasks', 'users', ['user_id'], ['id'])
    # ### end Alembic commands ###
