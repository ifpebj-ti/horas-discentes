using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Back.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveMaximoHorasExtensaoParaTurma : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaximoHorasExtensao",
                table: "LimitesHoras");

            migrationBuilder.AddColumn<int>(
                name: "MaximoHorasExtensao",
                table: "Turmas",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaximoHorasExtensao",
                table: "Turmas");

            migrationBuilder.AddColumn<int>(
                name: "MaximoHorasExtensao",
                table: "LimitesHoras",
                type: "integer",
                nullable: true);
        }
    }
}
