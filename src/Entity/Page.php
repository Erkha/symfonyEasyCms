<?php

declare(strict_types=1);

namespace App\Entity;

use App\Service\Slugger;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PageRepository")
 */
class Page
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @var string
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     *
     * @var string
     */
    private $slug;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Page", inversedBy="childs")
     *
     * @var Page
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Page", mappedBy="parent", fetch="EAGER")
     *
     * @var Collection|Page[]
     */
    private $childs;

    /** @var Slugger **/
    private $slugger;

    public function __construct()
    {
        $this->childs = new ArrayCollection();
        $this->slugger = new Slugger();
    }

    public function __toString(): string
    {
        return $this->getTitle();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        $this->slug = $this->slugger->slugify($title);

        return $this;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getChilds(): Collection
    {
        return $this->childs;
    }

    public function addChild(self $child): self
    {
        if (! $this->childs->contains($child)) {
            $this->childs[] = $child;
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): self
    {
        if ($this->childs->contains($child)) {
            $this->childs->removeElement($child);
            // set the owning side to null (unless already changed)
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }
}
