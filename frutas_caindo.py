import pygame
import random
import sys

# Inicializa o Pygame
pygame.init()

# Definições de tela
WIDTH, HEIGHT = 400, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Minigame: Prevenção à Candidíase")

# Cores
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)  # Cor verde para a mensagem de vitória

# Carrega as imagens
player_img = pygame.image.load('player.png')  # Imagem do jogador
good_items_imgs = {
    "leite": pygame.image.load('leite.png'),  # Imagem do leite
    "agua": pygame.image.load('agua.png'),    # Imagem da água
    "frutas": pygame.image.load('frutas.png')  # Imagem das frutas
}
bad_items_imgs = {
    "acucar": pygame.image.load('acucar.png'),  # Imagem do açúcar
    "doces": pygame.image.load('doces.png')     # Imagem dos doces
}
background_img = pygame.image.load('background.png')  # Imagem de fundo

# Classe do Jogador
class Hero:
    def __init__(self):
        self.rect = pygame.Rect(WIDTH // 2, HEIGHT - 50, 30, 30)

    def move(self, dx):
        self.rect.x += dx
        self.rect.x = max(0, min(WIDTH - self.rect.width, self.rect.x))

    def draw(self, surface):
        surface.blit(player_img, self.rect)  # Desenha a imagem do jogador

# Classe do Item Bom (saudável)
class HealthyItem:
    def __init__(self):
        self.item_type = random.choice(list(good_items_imgs.keys()))  # Escolhe aleatoriamente um item saudável
        self.rect = pygame.Rect(random.randint(0, WIDTH - 30), random.randint(-30, -10), 30, 30)

    def update(self):
        self.rect.y += 3  # Velocidade de queda

    def draw(self, surface):
        surface.blit(good_items_imgs[self.item_type], self.rect)  # Desenha a imagem do item saudável

# Classe do Item Ruim (prejudicial)
class UnhealthyItem:
    def __init__(self):
        self.item_type = random.choice(list(bad_items_imgs.keys()))  # Escolhe aleatoriamente um item prejudicial
        self.rect = pygame.Rect(random.randint(0, WIDTH - 30), random.randint(-30, -10), 30, 30)

    def update(self):
        self.rect.y += 5  # Velocidade de queda

    def draw(self, surface):
        surface.blit(bad_items_imgs[self.item_type], self.rect)  # Desenha a imagem do item prejudicial

# Função principal
def main():
    hero = Hero()
    healthy_items = []  # Inicia com lista vazia
    unhealthy_items = []  # Inicia com lista vazia
    score = 0

    clock = pygame.time.Clock()

    # Função para gerar itens continuamente
    def spawn_items():
        if random.random() < 0.05:  # 5% de chance de gerar um item saudável
            healthy_items.append(HealthyItem())
        if random.random() < 0.03:  # 3% de chance de gerar um item prejudicial
            unhealthy_items.append(UnhealthyItem())

    while True:
        # Verifica eventos
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        # Movimento do jogador
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            hero.move(-5)
        if keys[pygame.K_RIGHT]:
            hero.move(5)

        # Atualiza e verifica colisões
        for item in healthy_items[:]:
            item.update()
            if item.rect.y > HEIGHT:
                healthy_items.remove(item)  # Remove o item se sair da tela
            if hero.rect.colliderect(item.rect):
                healthy_items.remove(item)
                score += 10  # Aumenta a pontuação por itens saudáveis
                print(f"Pontos: {score}")

        for item in unhealthy_items[:]:
            item.update()
            if item.rect.y > HEIGHT:
                unhealthy_items.remove(item)  # Remove o item se sair da tela
            if hero.rect.colliderect(item.rect):
                unhealthy_items.remove(item)
                score -= 10  # Diminui a pontuação por itens prejudiciais
                print(f"Pontos: {score}")

        # Verifica se o jogo deve terminar
        if score < 0:
            end_game("Você pegou candidíase.")  # Mensagem de game over
            break
        elif score > 10:
            end_game("Parabéns! Boa saúde!", victory=True)  # Mensagem de vitória
            break
        
        # Desenha na tela
        screen.blit(background_img, (0, 0))  # Desenha a imagem de fundo
        hero.draw(screen)

        for item in healthy_items:
            item.draw(screen)

        for item in unhealthy_items:
            item.draw(screen)

        # Exibe o score na tela
        font = pygame.font.SysFont(None, 36)
        score_text = font.render(f'Pontuação: {score}', True, (0, 0, 0))
        screen.blit(score_text, (10, 10))

        # Instruções na tela
        instructions_font = pygame.font.SysFont(None, 28)  # Fonte menor para as instruções
        instructions_text = instructions_font.render('Coletar: Leite, Água, Frutas (Saudável)', True, (0, 0, 0))
        instructions_text2 = instructions_font.render('Evitar: Açúcar, Doces (Prejudicial)', True, (0, 0, 0))
        screen.blit(instructions_text, (10, 40))
        screen.blit(instructions_text2, (10, 70))

        pygame.display.flip()
        clock.tick(30)

        # Gera itens continuamente
        spawn_items()

# Função para encerrar o jogo
def end_game(message, victory=False):
    font = pygame.font.SysFont(None, 48)
    text_color = GREEN if victory else (255, 0, 0)  # Verde para vitória, vermelho para game over
    text = font.render(message, True, text_color)
    text_rect = text.get_rect(center=(200, 300))
    
    screen.fill(WHITE)  # Limpa a tela
    screen.blit(text, text_rect)
    pygame.display.flip()
    pygame.time.wait(3000)  # Espera 3 segundos antes de encerrar

# Inicia o jogo
if __name__ == "__main__":
    main()
