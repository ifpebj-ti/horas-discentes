using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Back.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeCursosCampusIdRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Campi_CampusId",
                table: "Cursos");

            migrationBuilder.AlterColumn<Guid>(
                name: "CampusId",
                table: "Cursos",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Campi_CampusId",
                table: "Cursos",
                column: "CampusId",
                principalTable: "Campi",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cursos_Campi_CampusId",
                table: "Cursos");

            migrationBuilder.AlterColumn<Guid>(
                name: "CampusId",
                table: "Cursos",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Cursos_Campi_CampusId",
                table: "Cursos",
                column: "CampusId",
                principalTable: "Campi",
                principalColumn: "Id");
        }
    }
}
