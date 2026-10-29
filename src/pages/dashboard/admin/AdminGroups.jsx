import ResourceManager from '../../../components/forms/ResourceManager';
import Media from '../../../components/ui/Media';
import { groupFields } from '../../../config/forms';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import PanelHead from '../PanelHead';

const columns = [
  {
    label: 'Grupo',
    render: (g) => (
      <div className="cell-main">
        <span className="thumb-sm"><Media src={g.image_url} alt="" seed={g.id} /></span>
        <strong>{g.name}</strong>
      </div>
    ),
  },
  { label: 'Descripción', render: (g) => g.description || '—' },
];

export default function AdminGroups() {
  useDocumentTitle('Grupos artísticos');
  return (
    <>
      <PanelHead
        title="Grupos artísticos"
        text="Creá, editá o eliminá los grupos y colectivos de la comunidad. Las y los artistas se suman desde su perfil."
      />
      <ResourceManager
        table="groups"
        fields={groupFields}
        columns={columns}
        singular="Grupo"
        plural="grupos"
        emptyText="Creá el primer grupo para organizar a la comunidad."
        createLabel="Crear grupo"
      />
    </>
  );
}
