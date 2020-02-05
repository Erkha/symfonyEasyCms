<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\ContactType;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="landing")
     */
    public function displayLandingPage(Request $request, MailerInterface $mailer): Response
    {
        $form = $this->createForm(
            ContactType::class,
            null,
            ['method' => Request::METHOD_POST]
        );
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $email = new TemplatedEmail();
            $email->from($_ENV['SERVER_MAIL'])
                    ->to($_ENV['ADMIN_MAIL'])
                    ->subject('nouveau contact AnimTheTime')
                    ->htmlTemplate('home/contact.html.twig')
                    ->context([
                        'message'   => $data['message'],
                        'name'      => $data['name'],
                        'mail'     => $data['email'],
                        'phone'     => $data['phone'],
                    ]);
            $mailer->send($email);

            $this->addFlash('success', 'votre message a bien été transmis');

            return $this->redirectToRoute('landing', ['_fragment' => 'contact']);
        }

        return $this->render('home/landing.html.twig', ['form' => $form->createView()]);
    }
}
