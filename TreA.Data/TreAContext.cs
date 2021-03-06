using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore.Identity;
using TreA.Data.Entities;

namespace TreA.Data
{
    public class TreAContext: IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public TreAContext(DbContextOptions<TreAContext> o ) : base(o) { }
        public virtual DbSet<Administrators> administrator { get; set; }
        public virtual DbSet<Categories> category { get; set; }
        public virtual DbSet<Arguments> argument { get; set; }
        public virtual DbSet<Posts> post { get; set; }
        public virtual DbSet<PhotoFolders> photoFolder { get; set; }
        public virtual DbSet<Photos> photo { get; set; }
        public virtual DbSet<Videos> video { get; set; }
        public virtual DbSet<Albums> album { get; set; }
        public virtual DbSet<Podcasts> podcast { get; set; }
        public virtual DbSet<Homes> home { get; set; }
        public virtual DbSet<Slugs> slug { get; set; }
        public virtual DbSet<Reviews> review { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
            optionsBuilder
                .ConfigureWarnings(warnings => 
                    warnings.Throw(RelationalEventId.QueryClientEvaluationWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Administrators>(entity => {
                entity.HasKey(e => e.id);
                entity.Property(e => e.user);
                entity.Property(e => e.password); 
                entity.Property(e => e.IsActive);
                entity.Property(e => e.rememberMe);
                entity.Property(e => e.photoId);
            });

            modelBuilder.Entity<Categories>(entity => {
                entity.HasKey(c => c.id);
                entity.Property(c => c.name);
                entity.Property(c => c.slugId);
                entity.Property(c => c.displayOrder);
                entity.Property(c => c.description);
            });

            modelBuilder.Entity<Arguments>(entity => { 
                entity.HasKey(a => a.id);
                entity.Property(a => a.name);
                entity.Property(a => a.slugId);
                entity.Property(a => a.description);
                entity.Property(c => c.coverImageId);
                entity.Property(c => c.livello);
                entity.Property(c => c.idPadre);
                entity.HasOne(c => c.category);
            });

            modelBuilder.Entity<Posts>(entity => { 
                entity.HasKey(p => p.id);
                entity.Property(p => p.title);
                entity.Property(p => p.subtitle);
                entity.Property(p => p.slugId);
                entity.Property(p => p.testo);
                entity.Property(p => p.pubblico);
                entity.Property(p => p.categoryId);
                entity.Property(p => p.argumentId);
                entity.Property(p => p.PhotoId);
                entity.Property(p => p.dateInsert);
            });

            modelBuilder.Entity<PhotoFolders>(entity => {
                entity.HasKey(p => p.id);
                entity.Property(p => p.name);
                entity.Property(p => p.path);
            });

            modelBuilder.Entity<Photos>(entity => {
                entity.HasKey(p => p.id);
                entity.Property(p => p.name);
                entity.Property(p => p.path);
                entity.Property(p => p.folderId);
            });

            modelBuilder.Entity<Videos>(entity => {
                entity.HasKey(v => v.id);
                entity.Property(v => v.name);
                entity.Property(v => v.path);
            });

            modelBuilder.Entity<Albums>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.idImmagini);
                entity.Property(a => a.idVideo);
            });

            modelBuilder.Entity<Podcasts>(entity => {
                entity.HasKey(p => p.id);
                entity.Property(p => p.name);
                entity.Property(p => p.description);
                entity.Property(p => p.path);
            });

            modelBuilder.Entity<Homes>(entity => {
                entity.HasKey(h => h.id);
                entity.Property(h => h.headerTitolo);
                entity.Property(h => h.headerTesto);
                entity.Property(h => h.headerImageId);
                entity.Property(h => h.newsletterImageId);
            });

            modelBuilder.Entity<Slugs>(entity => {
                entity.HasKey( s => s.id);
                entity.Property(s => s.name);
                entity.Property(s => s.entityname);
            });

            modelBuilder.Entity<Reviews>(entity => {
                entity.HasKey(r => r.id);
                entity.Property(r => r.postId);
                entity.Property(r => r.nome);
                entity.Property(r => r.titolo);
                entity.Property(r => r.email);
                entity.Property(r => r.testo);
                entity.Property(r => r.insertDate);
            });

        }

    }
}