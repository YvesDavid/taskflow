<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;


/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * Retourne un Paginator selon page, limit, tri et filtre.
     *
     * @return array{data: Task[], meta: array}
     */
    public function findByPage(
        int $page = 1,
        int $limit = 10,
        ?string $sort = null,
        string $direction = 'ASC',
        ?string $status = null,
        ?string $q = null
    ): array {
        $qb = $this->createQueryBuilder('t');

        // Filtre par statut si fourni
        if ($status) {
            $qb->andWhere('t.status = :status')
               ->setParameter('status', $status);
        }

        // Recherche texte simple dans titre/description
        if ($q) {
            $qb->andWhere('t.title LIKE :q OR t.description LIKE :q')
               ->setParameter('q', "%$q%");
        }

        // Tri
        if ($sort && in_array($sort, ['title', 'createdAt', 'status'], true)) {
            $qb->orderBy("t.$sort", strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC');
        } else {
            $qb->orderBy('t.createdAt', 'DESC');
        }

        // Offset + limit
        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $paginator = new Paginator($qb);
        $total    = count($paginator);

        // Récupère les entités de la page
        $data = iterator_to_array($paginator->getIterator());

        $meta = [
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => (int) ceil($total / $limit),
        ];

        return compact('data', 'meta');
    }

}
