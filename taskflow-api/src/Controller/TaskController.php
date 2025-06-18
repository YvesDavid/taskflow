<?php
namespace App\Controller;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Entity\Task;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

// Chemin pour toutes les opérations CRUD sur /api/tasks
#[Route('/api/tasks', name: 'api_tasks_')]
class TaskController extends AbstractController
{
    // Injection du gestionnaire d’entités et du validateur
    public function __construct(private EntityManagerInterface $em, private ValidatorInterface $validator) {}

    /**
     * GET /api/tasks
     * Récupère toutes les tâches en base
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $req): Response
    {
    // Récupère les query params avec valeurs par défaut
    $page      = max(1, (int) $req->query->get('page', 1));
    $limit     = max(1, (int) $req->query->get('limit', 10));
    $sort      = $req->query->get('sort');         // e.g. 'title'
    $direction = $req->query->get('direction', 'ASC');
    $status    = $req->query->get('status');       // e.g. 'todo'
    $q         = $req->query->get('q');            // search term

    // Appel au repository paginé
    $result = $this->em
                   ->getRepository(Task::class)
                   ->findByPage($page, $limit, $sort, $direction, $status, $q);

    // Retourne data + meta
    return $this->json([
        'data' => $result['data'],
        'meta' => $result['meta'],
    ]);
}


    #[Route('/{id}', name: 'read', methods: ['GET'])]
        public function read(int $id, Request $req): Response
        {
            $task = $this->em->getRepository(Task::class)->find($id);
            if (!$task) {
                return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
            }

            return $this->json($task);
        }


    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $req): Response
    {
        $data = json_decode($req->getContent(), true);

        $task = new Task();
        $task->setTitle($data['title'] ?? '');
        $task->setDescription($data['description'] ?? '');
        $task->setStatus($data['status'] ?? 'todo');

        // Validation des contraintes (NotBlank, Choice, etc.)
        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            $err = [];
            foreach ($errors as $v) {
                $err[$v->getPropertyPath()][] = $v->getMessage();
            }
            return $this->json(['errors' => $err], Response::HTTP_BAD_REQUEST);
        }

        // Persistance et flush
        $this->em->persist($task);
        $this->em->flush();

        // Renvoie 201 + la tâche créée
        return $this->json($task, Response::HTTP_CREATED);
    }


    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $req): Response
    {
        $task = $this->em->getRepository(Task::class)->find($id);
        if (!$task) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($req->getContent(), true);
        $task->setTitle($data['title'] ?? $task->getTitle());
        $task->setDescription($data['description'] ?? $task->getDescription());
        $task->setStatus($data['status'] ?? $task->getStatus());

        // → Validation
        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            $err = [];
            foreach ($errors as $violation) {
                $property = $violation->getPropertyPath();
                $err[$property][] = $violation->getMessage();
            }
            return $this->json(['errors' => $err], Response::HTTP_BAD_REQUEST);
        }

        // Pas besoin de persist() car l’entité est déjà gérée, on flush directement
        $this->em->flush();
        return $this->json($task);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): Response
    {
        $task = $this->em->getRepository(Task::class)->find($id);
        if (!$task) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($task);
        $this->em->flush();
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
