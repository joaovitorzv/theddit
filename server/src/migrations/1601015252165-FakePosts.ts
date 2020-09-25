import { MigrationInterface, QueryRunner } from "typeorm";

export class FakePosts1601015252169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        insert into post (title, text, "creatorId") values ('Beyond the Lights', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

        Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.', 2);
        insert into post (title, text, "creatorId") values ('Special Correspondents (Envoyés très spéciaux)', 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.
        
        Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 2);
        insert into post (title, text, "creatorId") values ('Flock of Dodos: The Evolution-Intelligent Design Circus', 'Fusce consequat. Nulla nisl. Nunc nisl.
        
        Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.', 2);
        insert into post (title, text, "creatorId") values ('Outlaw Blues', 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.
        
        Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.
        
        Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.', 2);
        insert into post (title, text, "creatorId") values ('Alla älskar Alice', 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.
        
        Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', 2);
        insert into post (title, text, "creatorId") values ('Interceptor', 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.
        
        Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.
        
        Phasellus in felis. Donec semper sapien a libero. Nam dui.', 2);
        insert into post (title, text, "creatorId") values ('Third World Cop', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.', 2);
        `)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
