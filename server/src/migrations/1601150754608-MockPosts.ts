import { MigrationInterface, QueryRunner } from "typeorm";

export class MockPosts1601150754608 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        insert into post (title, text, "creatorId", "createdAt") values ('Tai-Pan', 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.', 1, '2019-10-08T07:32:25Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Reader, The', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', 1, '2020-06-10T08:03:18Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Pan''s Labyrinth (Laberinto del fauno, El)', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', 1, '2020-07-27T19:08:36Z');
        insert into post (title, text, "creatorId", "createdAt") values ('George and the Dragon', 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.

        Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.', 1, '2020-07-07T10:07:48Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Skyline', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.

        Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.', 1, '2020-05-18T03:18:25Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Summer Magic', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', 1, '2020-01-20T02:07:39Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Rapid Fire', 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.

        In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.', 1, '2019-11-20T21:55:09Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Beyond, The (E tu vivrai nel terrore - L''aldilà)', 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.

        Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', 1, '2019-10-24T09:07:05Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Great McGinty, The', 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.', 1, '2019-10-02T04:14:16Z');
        insert into post (title, text, "creatorId", "createdAt") values ('Slap Shot 2: Breaking the Ice', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

        Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', 1, '2020-03-29T17:06:47Z');       
    `);
    }

    public async down(_: QueryRunner): Promise<void> { }
}
